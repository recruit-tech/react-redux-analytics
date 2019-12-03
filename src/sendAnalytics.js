import React, { Component } from 'react'
import { ReactReduxContext } from 'react-redux'
import pickBy from 'lodash.pickby'
import hoistStatics from 'hoist-non-react-statics'
import { getDisplayName, valueOrFunction, isFunction } from './utils'
import { sendPageView, snapshotPageProps } from './actions'
import { sendAnalyticsPropertyName } from './names'

const composeVariables = (staticVariables, mapPropsToVariables) => (
  props,
  state
) => {
  if (!isFunction(mapPropsToVariables)) {
    return { ...staticVariables }
  }

  const mappedVars = mapPropsToVariables(props, state)
  return { ...pickBy(mappedVars, Boolean), ...staticVariables }
}

export default ({
  sendPageViewOnDidMount = true /* boolean | (props: Object, state: Object) => boolean */,
  sendPageViewOnDidUpdate = false /* boolean | ( prevProps: Object, props: Object, state: Object) => boolean */,
  mapPropsToVariables /* (props: Object, state: Object) => Object */,
  onDataReady = true /* boolean | (props: Object, state: Object) => boolean */,
  snapshotPropsOnPageView = false /* boolean | (props: Object, state: Object) => boolean */,
  mixins = [],
  ...staticVariables
}) => (WrappedComponent) => {
  const composeVars = composeVariables(staticVariables, mapPropsToVariables)
  const shouldSendOnDidMount = valueOrFunction(sendPageViewOnDidMount)
  const shouldSendOnDidUpdate = valueOrFunction(sendPageViewOnDidUpdate)
  const canSendPageView = valueOrFunction(onDataReady)
  const shouldsnapshotProps = valueOrFunction(snapshotPropsOnPageView)

  class WrapperComponent extends Component {
    constructor(props) {
      super(props)
      this.isPageViewScheduled = false
      this.preventDuplicate = false
    }

    componentDidMount() {
      const { dispatch, getState } = this.props.ctx.store
      const state = getState()
      if (shouldSendOnDidMount(this.props, state)) {
        this.schedulePageView(this.props, state, dispatch)
      }
    }

    componentWillReceiveProps(nextProps) {
      this.preventDuplicate = false
      const { dispatch, getState } = this.props.ctx.store
      const state = getState()
      if (this.isPageViewScheduled && canSendPageView(nextProps, state)) {
        this.isPageViewScheduled = false
        this.preventDuplicate = true
        const variables = composeVars(nextProps, state)
        if (shouldsnapshotProps(nextProps, state)) {
          dispatch(snapshotPageProps(nextProps))
        }
        dispatch(sendPageView(variables, mixins))
      }
    }

    componentDidUpdate(prevProps) {
      const { dispatch, getState } = this.props.ctx.store
      const state = getState()
      if (shouldSendOnDidUpdate(prevProps, this.props, state)) {
        this.schedulePageView(this.props, state, dispatch)
      }
    }

    schedulePageView(props, state, dispatch) {
      if (canSendPageView(props, state)) {
        if (this.preventDuplicate) {
          return
        }
        const variables = composeVars(props, state)
        if (shouldsnapshotProps(props, state)) {
          dispatch(snapshotPageProps(props))
        }
        dispatch(sendPageView(variables, mixins))
      } else {
        this.isPageViewScheduled = true
      }
    }

    render() {
      const { store } = this.props.ctx
      return (
        <WrappedComponent
          {...{
            ...this.props,
            store,
          }}
        />
      )
    }
  }

  function WrapperComponentWithContext(props) {
    return (
      <ReactReduxContext.Consumer>
        {(store) => <WrapperComponent {...props} ctx={{ store }} />}
      </ReactReduxContext.Consumer>
    )
  }

  WrapperComponentWithContext.displayName = `SendAnalytics(${getDisplayName(
    WrappedComponent
  )})`

  // let the ensurePageView HoC know that this component implments sendAnalytics
  WrapperComponentWithContext[sendAnalyticsPropertyName] =
    WrapperComponentWithContext.displayName

  return hoistStatics(WrapperComponentWithContext, WrappedComponent)
}
