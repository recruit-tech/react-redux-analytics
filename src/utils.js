export const isServer = () => {
  if (typeof (window) !== 'object') {
    return true
  }

  return false
}

export const getDisplayName = (component) => component.displayName || component.name

export const isFunction = (fn) => typeof fn === 'function'

export const valueOrFunction = (test) => (...args) => {
  if (!isFunction(test)) {
    return test
  }

  return test(...args)
}
