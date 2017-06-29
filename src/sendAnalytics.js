import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isFunction } from 'lodash/fp'
import hoistStatics from 'hoist-non-react-statics'
import { getDisplayName, valueOrFunction } from './utils'
import { sendPageView, popLocation, LOCATION_PUSH } from './actions'
import { sendAnalyticsPropertyName } from './names'

const composeVariables = (staticVariables, mapPropsToVariables) => (props, state) => {
  if (!isFunction(mapPropsToVariables)) {
    return { ...staticVariables }
  }

  const mappedVars = mapPropsToVariables(props, state, staticVariables)
  return { ...staticVariables, ...mappedVars }
}

export default ({
  sendPageViewOnDidMount = true, /* boolean | (props: Object, state: Object) => boolean */
  sendPageViewOnDidUpdate = false, /* boolean | ( prevProps: Object, props: Object, state: Object) => boolean */
  pushLocationOnDidUpdate = false, /* boolean | ( prevProps: Object, props: Object, state: Object) => boolean */
  popLocationOnDidUpdate = false, /* boolean | ( prevProps: Object, props: Object, state: Object) => boolean */
  locationPushPayload = {}, /* Object | (props: Object, state: Object) => Object */
  mapPropsToVariables, /* (props: Object, state: Object) => Object */
  onDataReady = true, /* boolean | (props: Object, state: Object) => boolean */
  mixins = [],
  ...staticVariables
}) => (WrappedComponent) => {
  const composeVars = composeVariables(staticVariables, mapPropsToVariables)
  const shouldSendOnDidMount = valueOrFunction(sendPageViewOnDidMount)
  const shouldSendOnDidUpdate = valueOrFunction(sendPageViewOnDidUpdate)
  const shouldPushOnDidUpdate = valueOrFunction(pushLocationOnDidUpdate)
  const shouldPopOnDidUpdate = valueOrFunction(popLocationOnDidUpdate)
  const getLocationPushPayload = valueOrFunction(locationPushPayload)
  const canSendPageView = valueOrFunction(onDataReady)

  class WrapperComponent extends Component {

    constructor(props, context) {
      super(props, context)
      this.isPageViewScheduled = false
    }

    componentDidMount() {
      const { dispatch, getState } = this.context.store
      const state = getState()
      if (shouldSendOnDidMount(this.props, state)) {
        this.schedulePageView(this.props, state, dispatch)
      }
    }

    componentWillReceiveProps(nextProps) {
      const { dispatch, getState } = this.context.store
      const state = getState()
      if (this.isPageViewScheduled && canSendPageView(nextProps, state)) {
        const variables = composeVars(nextProps, state)
        dispatch(sendPageView(variables, mixins))
        this.isPageViewScheduled = false
      }
    }

    componentDidUpdate(prevProps) {
      const { dispatch, getState } = this.context.store
      const state = getState()
      if (shouldPushOnDidUpdate(prevProps, this.props, state)) {
        const payload = getLocationPushPayload(this.props, state)
        dispatch({
          type: LOCATION_PUSH,
          payload,
        })
      }

      if (shouldPopOnDidUpdate(prevProps, this.props, state)) {
        dispatch(popLocation())
      }

      if (shouldSendOnDidUpdate(prevProps, this.props, state)) {
        this.schedulePageView(this.props, state, dispatch)
      }
    }

    schedulePageView(props, state, dispatch) {
      if (canSendPageView(props, state)) {
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
