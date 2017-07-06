import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isFunction, pickBy } from 'lodash/fp'
import hoistStatics from 'hoist-non-react-statics'
import { getDisplayName, valueOrFunction } from './utils'
import { sendPageView } from './actions'
import { sendAnalyticsPropertyName } from './names'

const composeVariables = (staticVariables, mapPropsToVariables) => (props, state) => {
  if (!isFunction(mapPropsToVariables)) {
    return { ...staticVariables }
  }

  const mappedVars = mapPropsToVariables(props, state)
  return { ...pickBy(Boolean)(mappedVars), ...staticVariables }
}

export default ({
  sendPageViewOnDidMount = true, /* boolean | (props: Object, state: Object) => boolean */
  sendPageViewOnDidUpdate = false, /* boolean | ( prevProps: Object, props: Object, state: Object) => boolean */
  mapPropsToVariables, /* (props: Object, state: Object) => Object */
  onDataReady = true, /* boolean | (props: Object, state: Object) => boolean */
  mixins = [],
  ...staticVariables
}) => (WrappedComponent) => {
  const composeVars = composeVariables(staticVariables, mapPropsToVariables)
  const shouldSendOnDidMount = valueOrFunction(sendPageViewOnDidMount)
  const shouldSendOnDidUpdate = valueOrFunction(sendPageViewOnDidUpdate)
  const canSendPageView = valueOrFunction(onDataReady)

  class WrapperComponent extends Component {

    constructor(props, context) {
      super(props, context)
      this.isPageViewScheduled = false
      this.preventDuplicate = false
    }

    componentDidMount() {
      const { dispatch, getState } = this.context.store
      const state = getState()
      if (shouldSendOnDidMount(this.props, state)) {
        this.schedulePageView(this.props, state, dispatch)
      }
    }

    componentWillReceiveProps(nextProps) {
      this.preventDuplicate = false
      const { dispatch, getState } = this.context.store
      const state = getState()
      if (this.isPageViewScheduled && canSendPageView(nextProps, state)) {
        this.isPageViewScheduled = false
        this.preventDuplicate = true
        const variables = composeVars(nextProps, state)
        dispatch(sendPageView(variables, mixins))
      }
    }

    componentDidUpdate(prevProps) {
      const { dispatch, getState } = this.context.store
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
        dispatch(sendPageView(variables, mixins))
      } else {
        this.isPageViewScheduled = true
      }
    }

    render() {
      return (<WrappedComponent {...this.props} />)
    }
  }

  WrapperComponent.displayName = `SendAnalytics(${getDisplayName(WrappedComponent)})`
  WrapperComponent.contextTypes = {
    store: PropTypes.object.isRequired,
  }

  // let the ensurePageView HoC know that this component implments sendAnalytics
  WrapperComponent[sendAnalyticsPropertyName] = WrapperComponent.displayName
  return hoistStatics(WrapperComponent, WrappedComponent)
}
