import { pushLocation, popLocation, replaceLocation } from './actions'

export default ({ dispatch }) => {
  const notify = (location, action = 'replace') => {
    switch (action) {
      case 'pop':
        return dispatch(popLocation())
      case 'push':
        return dispatch(pushLocation(location, false, {}))
      case 'replace':
      default:
        return dispatch(replaceLocation(location, false, {}))
    }
  }
  return {
    notify,
  }
}
