import { pick } from 'lodash/fp'
import { reducerName as defaultReducerName } from './names'
import { SEND_PAGE_VIEW, SEND_EVENT } from './actions'

/* eslint-disable callback-return */

const composeMixinVariables = (reducerName, defaultMixins = [], mapStateToVariables = () => ({})) =>
(mixins, state) => {
  const { [reducerName]: { page, global } } = state
  const mappedVariables = mapStateToVariables(state)
  if (mixins === false) {
    return {}
  }

  const mergedVars = { ...mappedVariables, ...global.variables, ...page.variables }
  if (mixins === true) {
    return mergedVars
  }

  if (Array.isArray(mixins)) {
    return pick([...defaultMixins, ...mixins])(mergedVars)
  }

  return pick([...defaultMixins])(mergedVars)
}

const composePageViewPayload = ({
  reducerName,
  defaultMixins,
  mapStateToVariables,
  getLocationInStore,
  }) => {
  const composeMixin = composeMixinVariables(reducerName, defaultMixins, mapStateToVariables)
  return ({ variables, location, mixins, ...rest }, state) => ({
    ...rest,
    location: location || state[reducerName].page.location || getLocationInStore(state) || null,
    variables: {
      ...composeMixin(mixins, state),
      ...variables,
    },
    update: {
      variables,
      location: location || null,
    },
  })
}

const composeEventPayload = ({
  reducerName,
  defaultMixins,
  mapStateToVariables,
  composeEventName,
  }) => {
  const composeMixin = composeMixinVariables(reducerName, defaultMixins, mapStateToVariables)
  return ({ variables, mixins, eventName, ...rest }, state) => {
    const composedVariables = { ...composeMixin(mixins, state), ...variables }
    return {
      ...rest,
      eventName: eventName || composeEventName(composedVariables, state) || null,
      variables: composedVariables,
    }
  }
}

export default ({
  pageViewMixins = [],
  eventMixins = [],
  mapStateToVariables = () => ({}), /* (state: Object) => Object */
  getLocationInStore = () => null, /* (state: Object) => Object */
  composeEventName = () => null, /* (composedVariables: Object, state: Object) => string | null */
  suppressPageView = () => false, /* (state: Object, action: Object) => boolean */
  reducerName = defaultReducerName,
} = {}) => {
  const pageViewPayload = composePageViewPayload({ reducerName,
    defaultMixins: pageViewMixins,
    mapStateToVariables,
    getLocationInStore,
  })
  const eventPayload = composeEventPayload({ reducerName,
    defaultMixins: eventMixins,
    mapStateToVariables,
    composeEventName,
  })

  return ({ dispatch, getState }) => (next) => (action) => {
    if (action.type === SEND_PAGE_VIEW) {
      const state = getState()
      const transformed = { ...action, payload: pageViewPayload(action.payload, state) }
      if (suppressPageView(state, transformed)) {
        return null
      }
      return next(transformed)
    }
    if (action.type === SEND_EVENT) {
      return next({ ...action, payload: eventPayload(action.payload, getState()) })
    }
    return next(action)
  }
}
