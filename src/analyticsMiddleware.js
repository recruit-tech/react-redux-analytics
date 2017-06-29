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

  return {}
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
    location: location || state[reducerName].page.location || getLocationInStore(state),
    variables: {
      ...composeMixin(mixins, state),
      ...variables,
    },
    update: {
      variables,
      location,
    },
  })
}

const composeEventPayload = ({
  reducerName,
  defaultMixins,
  mapStateToVariables,
  }) => {
  const composeMixin = composeMixinVariables(reducerName, defaultMixins, mapStateToVariables)
  return ({ variables, mixins, ...rest }, state) => ({
    ...rest,
    variables: {
      ...composeMixin(mixins, state),
      ...variables,
    },
  })
}

export default ({
  pageViewMixins = [],
  eventMixins = [],
  mapStateToVariables = () => ({}), /* (store: Redux.Store) => Object */
  getLocationInStore =
   () => ({ pathname: '/', search: '', hash: '' }), /* (store: Redux.Store) => Object */
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
  })

  return ({ dispatch, getState }) => (next) => (action) => {
    if (action.type === SEND_PAGE_VIEW) {
      return next({ ...action, payload: pageViewPayload(action.payload, getState()) })
    }

    if (action.type === SEND_EVENT) {
      return next({ ...action, payload: eventPayload(action.payload, getState()) })
    }
    return next(action)
  }
}
