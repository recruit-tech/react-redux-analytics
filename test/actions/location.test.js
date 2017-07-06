import { describe, it } from 'mocha'
import { expect } from 'chai'
import { pushLocation, popLocation, replaceLocation,
  LOCATION_PUSH, LOCATION_POP, LOCATION_REPLACE,
 } from '../../src/actions'

describe('pushLocation', () => {
  it('default', () => {
    const action = pushLocation({
      pathname: '/',
      search: '',
      hash: '',
    })
    expect(action).to.deep.equal({
      type: LOCATION_PUSH,
      payload: {
        location: {
          pathname: '/',
          search: '',
          hash: '',
        },
        variables: {},
        inherits: false,
      },
    })
  })
  it('with inherits = true', () => {
    const action = pushLocation({
      pathname: '/',
      search: '',
      hash: '',
    }, true)
    expect(action).to.deep.equal({
      type: LOCATION_PUSH,
      payload: {
        location: {
          pathname: '/',
          search: '',
          hash: '',
        },
        variables: {},
        inherits: true,
      },
    })
  })
  it('with inherits = array', () => {
    const action = pushLocation({
      pathname: '/',
      search: '',
      hash: '',
    }, ['prop10', 'prop11', 'prop12'])
    expect(action).to.deep.equal({
      type: LOCATION_PUSH,
      payload: {
        location: {
          pathname: '/',
          search: '',
          hash: '',
        },
        variables: {},
        inherits: ['prop10', 'prop11', 'prop12'],
      },
    })
  })
  it('with variables', () => {
    const action = pushLocation({
      pathname: '/',
      search: '',
      hash: '',
    }, false, {
      prop10: 'prop10 from topPageProps',
      prop11: 'prop11 from topPageProps',
      prop20: 'prop20 from topPageProps',
      prop30: 'prop30 from topPageProps',
    })
    expect(action).to.deep.equal({
      type: LOCATION_PUSH,
      payload: {
        location: {
          pathname: '/',
          search: '',
          hash: '',
        },
        variables: {
          prop10: 'prop10 from topPageProps',
          prop11: 'prop11 from topPageProps',
          prop20: 'prop20 from topPageProps',
          prop30: 'prop30 from topPageProps',
        },
        inherits: false,
      },
    })
  })
})

describe('popLocation', () => {
  it('default', () => {
    const action = popLocation()
    expect(action).to.deep.equal({
      type: LOCATION_POP,
      payload: {
      },
    })
  })
})

describe('replaceLocation', () => {
  it('default', () => {
    const action = replaceLocation({
      pathname: '/',
      search: '',
      hash: '',
    })
    expect(action).to.deep.equal({
      type: LOCATION_REPLACE,
      payload: {
        location: {
          pathname: '/',
          search: '',
          hash: '',
        },
        variables: {},
        inherits: false,
      },
    })
  })
  it('with inherits = true', () => {
    const action = replaceLocation({
      pathname: '/',
      search: '',
      hash: '',
    }, true)
    expect(action).to.deep.equal({
      type: LOCATION_REPLACE,
      payload: {
        location: {
          pathname: '/',
          search: '',
          hash: '',
        },
        variables: {},
        inherits: true,
      },
    })
  })
  it('with inherits = array', () => {
    const action = replaceLocation({
      pathname: '/',
      search: '',
      hash: '',
    }, ['prop10', 'prop11', 'prop12'])
    expect(action).to.deep.equal({
      type: LOCATION_REPLACE,
      payload: {
        location: {
          pathname: '/',
          search: '',
          hash: '',
        },
        variables: {},
        inherits: ['prop10', 'prop11', 'prop12'],
      },
    })
  })
  it('with variables', () => {
    const action = replaceLocation({
      pathname: '/',
      search: '',
      hash: '',
    }, false, {
      prop10: 'prop10 from topPageProps',
      prop11: 'prop11 from topPageProps',
      prop20: 'prop20 from topPageProps',
      prop30: 'prop30 from topPageProps',
    })
    expect(action).to.deep.equal({
      type: LOCATION_REPLACE,
      payload: {
        location: {
          pathname: '/',
          search: '',
          hash: '',
        },
        variables: {
          prop10: 'prop10 from topPageProps',
          prop11: 'prop11 from topPageProps',
          prop20: 'prop20 from topPageProps',
          prop30: 'prop30 from topPageProps',
        },
        inherits: false,
      },
    })
  })
})
