import { handleActions } from 'redux-actions'
import pick from 'lodash.pick'
import { LOCATION_PUSH, LOCATION_POP, LOCATION_REPLACE,
  GLOBAL_VARIABLES_CLEAR, GLOBAL_VARIABLES_UPDATE,
  PAGE_VARIABLES_CLEAR, PAGE_VARIABLES_UPDATE, SEND_PAGE_VIEW,
  PAGE_SNAPSHOT_PROPS,
 } from './actions'

const MAX_LOCATION_STACK = 20

/**
 * Internal funciton
 */
const inheritVariables = (variables, page, inherits) => {
  if (inherits === true) {
    return { ...page.variables, ...variables }
  }
  if (Array.isArray(inherits)) {
    return { ...pick(page.variables, inherits), ...variables }
  }
  return variables
}

/**
 * Initial state
 */
const INITIAL_STATE = {
  global: {
    variables: {},
  },
  page: {
    location: null,
    variables: {},
    lastPageViewSent: null,
    snapshot: null,
  },
  prevPages: [],
  initialState: true,
}

/**
 * Reducer
 */
export default handleActions({
  [GLOBAL_VARIABLES_CLEAR]: (state, { payload }) => ({
    ...state,
    global: {
      ...state.global,
      variables: {
      },
    },
  }),
  [GLOBAL_VARIABLES_UPDATE]: (state, { payload: { variables } }) => ({
    ...state,
    global: {
      ...state.global,
      variables: {
        ...state.global.variables,
        ...variables,
      },
    },
  }),
  [PAGE_VARIABLES_CLEAR]: (state, { payload }) => ({
    ...state,
    page: {
      ...state.page,
      variables: {
      },
    },
  }),
  [PAGE_VARIABLES_UPDATE]: (state, { payload: { variables } }) => ({
    ...state,
    page: {
      ...state.page,
      variables: {
        ...state.page.variables,
        ...variables,
      },
    },
  }),
  [PAGE_SNAPSHOT_PROPS]: (state, { payload: { props } }) => ({
    ...state,
    page: {
      ...state.page,
      snapshot: props,
    },
  }),
  [LOCATION_PUSH]: (state, { payload: { location, variables = {}, inherits = false } }) => {
    const prevPages = state.initialState ? [] : [state.page, ...state.prevPages].slice(0, MAX_LOCATION_STACK)
    const inherited = inheritVariables(variables, state.page, inherits)
    return {
      ...state,
      prevPages,
      page: {
        variables: inherited,
        location,
        lastPageViewSent: null,
        snapshot: null,
      },
      initialState: false,
    }
  },
  [LOCATION_REPLACE]: (state, { payload: { location, variables = {}, inherits = false } }) => {
    const inherited = inheritVariables(variables, state.page, inherits)
    return {
      ...state,
      page: {
        variables: inherited,
        location,
        lastPageViewSent: null,
        snapshot: null,
      },
      initialState: false,
    }
  },
  [LOCATION_POP]: (state, payload) => {
    const prevPages = [...state.prevPages]
    if (prevPages.length < 1) {
      // eslint-disable-next-line no-console
      console.warn(`Location stack is empty. Max stack size = ${MAX_LOCATION_STACK}`)
    }
    const page = prevPages.shift() || state.page
    return {
      ...state,
      prevPages,
      page,
    }
  },
  [SEND_PAGE_VIEW]: (state, { payload: { location = null, variables = {}, update = {} } }) => {
    const { variables: updateVariables = {}, location: updateLocation = null } = update
    return {
      ...state,
      page: {
        ...state.page,
        variables: { ...state.page.variables, ...updateVariables },
        location: updateLocation || state.page.location,
        lastPageViewSent: {
          variables,
          location,
        },
      },
      initialState: false,
    }
  },
}, INITIAL_STATE)
