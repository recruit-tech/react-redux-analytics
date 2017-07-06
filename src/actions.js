import { createAction } from 'redux-actions'

/**
 * Action types
 */
const ANALYTICS = 'recruit-redux-analytics'

export const GLOBAL_VARIABLES_CLEAR = ANALYTICS + '/global/variables/clear'
export const GLOBAL_VARIABLES_UPDATE = ANALYTICS + '/global/variables/update'

export const PAGE_VARIABLES_CLEAR = ANALYTICS + '/page/variables/clear'
export const PAGE_VARIABLES_UPDATE = ANALYTICS + '/page/variables/update'

export const LOCATION_PUSH = ANALYTICS + '/location/push'
export const LOCATION_POP = ANALYTICS + '/location/pop'
export const LOCATION_REPLACE = ANALYTICS + '/location/replace'

export const SEND_PAGE_VIEW = ANALYTICS + '/send/page-view'
export const SEND_EVENT = ANALYTICS + '/send/event'
export const FALLBACK_PAGEVIEW = ANALYTICS + '/fallback-pageview'

/**
 * Action creators
 */
export const pushLocation = createAction(LOCATION_PUSH,
 (location, inherits = false, variables = {}) => ({ location, variables, inherits }))
export const popLocation = createAction(LOCATION_POP, () => ({}))
export const replaceLocation = createAction(LOCATION_REPLACE,
  (location, inherits = false, variables = {}) => ({ location, variables, inherits }))

export const sendPageView = createAction(SEND_PAGE_VIEW,
 (variables = {}, mixins = [], location = null) => ({ location, variables, mixins }))
export const sendEvent = createAction(SEND_EVENT,
 (variables = {}, mixins = []) => ({ variables, mixins }))

export const clearGlobalVariables = createAction(GLOBAL_VARIABLES_CLEAR, () => ({}))
export const updateGlobalVariables = createAction(GLOBAL_VARIABLES_UPDATE, (variables) => ({ variables }))
export const clearPageVariables = createAction(PAGE_VARIABLES_CLEAR, () => ({}))
export const updatePageVariables = createAction(PAGE_VARIABLES_UPDATE, (variables) => ({ variables }))
export const fallbackPageView = createAction(FALLBACK_PAGEVIEW, (location) => ({ location }))
