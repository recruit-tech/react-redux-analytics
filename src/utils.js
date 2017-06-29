import { isFunction } from 'lodash/fp'

export const isServer = () => {
  if (typeof (window) !== 'object') {
    return true
  }

  return false
}

export const getDisplayName = (component) => component.displayName || component.name

export const valueOrFunction = (test) => (...args) => {
  if (!isFunction(test)) {
    return test
  }

  return test(...args)
}
