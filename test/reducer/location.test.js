import { describe, it } from 'mocha'
import { expect } from 'chai'
import { pushLocation, replaceLocation, popLocation } from '../../src/actions'
import reducer from '../../src/reducer'

const initialState = {
  global: {
    variables: {},
  },
  page: {
    location: undefined,
    variables: {},
    lastPageViewSent: undefined,
  },
  prevPages: [],
  initialState: true,
}

// push
const secondState = {
  global: {
    variables: {},
  },
  page: {
    location: {
      pathname: '/',
      search: '',
      hash: '',
    },
    variables: {
      prop10: 'prop10 from topPageProps',
      prop11: 'prop11 from topPageProps',
      prop15: 'prop15 from topPageProps',
    },
    lastPageViewSent: undefined,
  },
  prevPages: [],
  initialState: false,
}

// push -> push
const thirdState = {
  global: {
    variables: {},
  },
  page: {
    location: {
      pathname: '/news',
      search: '',
      hash: '',
    },
    variables: {
      prop10: 'prop10 from topPageProps',
      // prop11: 'prop11 from topPageProps', // inherit but overridden
      prop11: 'prop11 from newsPageProps',
      prop12: 'prop12 from newsPageProps',
    },
    lastPageViewSent: undefined,
  },
  prevPages: [{
    location: {
      pathname: '/',
      search: '',
      hash: '',
    },
    variables: {
      prop10: 'prop10 from topPageProps',
      prop11: 'prop11 from topPageProps',
      prop15: 'prop15 from topPageProps',
    },
    lastPageViewSent: undefined,
  }],
  initialState: false,
}

describe('pushLocation', () => {
  it('first', () => {
    const state = { ...initialState }
    const action = pushLocation({
      pathname: '/',
      search: '',
      hash: '',
    })
    const state2 = reducer(state, action)
    expect(state2.page).to.deep.equal({
      location: {
        pathname: '/',
        search: '',
        hash: '',
      },
      variables: {},
      lastPageViewSent: undefined,
    })
    // confirm no side-effect
    expect(state2.initialState).to.deep.equal(false)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })

  it('with variables', () => {
    const state = { ...initialState }
    const action = pushLocation({
      pathname: '/',
      search: '',
      hash: '',
    }, false, {
      prop10: 'prop10 from topPageProps',
      prop11: 'prop11 from topPageProps',
      prop15: 'prop15 from topPageProps',
    })
    const state2 = reducer(state, action)
    expect(state2).to.deep.equal(secondState)
  })

  it('with inherits = true', () => {
    const state = { ...secondState }
    const action = pushLocation({
      pathname: '/news',
      search: '',
      hash: '',
    }, true, {
      prop11: 'prop11 from newsPageProps',
      prop12: 'prop12 from newsPageProps',
    })
    const state2 = reducer(state, action)
    expect(state2.page).to.deep.equal({
      location: {
        pathname: '/news',
        search: '',
        hash: '',
      },
      variables: {
        prop10: 'prop10 from topPageProps',
        // prop11: 'prop11 from topPageProps', // inherit but overridden
        prop11: 'prop11 from newsPageProps',
        prop12: 'prop12 from newsPageProps',
        prop15: 'prop15 from topPageProps',
      },
      lastPageViewSent: undefined,
    })
  })

  it('with inherits = array', () => {
    const state = { ...secondState }
    const action = pushLocation({
      pathname: '/news',
      search: '',
      hash: '',
    }, ['prop10', 'prop11'], {
      prop11: 'prop11 from newsPageProps',
      prop12: 'prop12 from newsPageProps',
    })
    const state2 = reducer(state, action)
    expect(state2).to.deep.equal(thirdState)
  })

  it('push 3 times', () => {
    const state0 = { ...initialState }
    const push1 = pushLocation({
      pathname: '/',
      search: '',
      hash: '',
    }, false, {
      prop10: 'prop10 from topPageProps',
      prop11: 'prop11 from topPageProps',
      prop15: 'prop15 from topPageProps',
    })
    const push2 = pushLocation({
      pathname: '/news',
      search: '',
      hash: '',
    }, ['prop10', 'prop11'], {
      prop11: 'prop11 from newsPageProps',
      prop12: 'prop12 from newsPageProps',
    })
    const push3 = pushLocation({
      pathname: '/news/latest',
      search: '',
      hash: '',
    }, true)
    const state1 = reducer(state0, push1)
    const state2 = reducer(state1, push2)
    const state3 = reducer(state2, push3)
    expect(state3.page).to.deep.equal({
      location: {
        pathname: '/news/latest',
        search: '',
        hash: '',
      },
      variables: {
        prop10: 'prop10 from topPageProps',
        prop11: 'prop11 from newsPageProps',
        prop12: 'prop12 from newsPageProps',
      },
      lastPageViewSent: undefined,
    })
    expect(state3.prevPages[0]).to.deep.equal(state2.page)
    expect(state3.prevPages[1]).to.deep.equal(state1.page)
    expect(state3.prevPages).to.have.length(2)
  })
})

describe('replaceLocation', () => {
  it('first', () => {
    const state = { ...initialState }
    const action = replaceLocation({
      pathname: '/',
      search: '',
      hash: '',
    })
    const state2 = reducer(state, action)
    expect(state2.page).to.deep.equal({
      location: {
        pathname: '/',
        search: '',
        hash: '',
      },
      variables: {},
      lastPageViewSent: undefined,
    })
    // confirm no side-effect
    expect(state2.initialState).to.deep.equal(false)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })

  it('with variables', () => {
    const state = { ...initialState }
    const action = replaceLocation({
      pathname: '/',
      search: '',
      hash: '',
    }, false, {
      prop10: 'prop10 from topPageProps',
      prop11: 'prop11 from topPageProps',
      prop15: 'prop15 from topPageProps',
    })
    const state2 = reducer(state, action)
    expect(state2).to.deep.equal(secondState)
  })

  it('with inherits = array', () => {
    const state = { ...secondState }
    const action = replaceLocation({
      pathname: '/news',
      search: '',
      hash: '',
    }, ['prop10', 'prop11'], {
      prop11: 'prop11 from newsPageProps',
      prop12: 'prop12 from newsPageProps',
    })
    const state2 = reducer(state, action)
    expect(state2.page).to.deep.equal(thirdState.page)
    expect(state2.prevPages).to.deep.equal([])
  })

  it('replace after push+push', () => {
    const state = { ...thirdState }
    const action = replaceLocation({
      pathname: '/news/latest',
      search: '',
      hash: '',
    }, true)
    const state2 = reducer(state, action)
    expect(state2.page).to.deep.equal({
      location: {
        pathname: '/news/latest',
        search: '',
        hash: '',
      },
      variables: {
        prop10: 'prop10 from topPageProps',
        prop11: 'prop11 from newsPageProps',
        prop12: 'prop12 from newsPageProps',
      },
      lastPageViewSent: undefined,
    })
    expect(state2.prevPages).to.deep.equal(state.prevPages)
  })

  it('replace 3 times', () => {
    const state0 = { ...initialState }
    const replace1 = replaceLocation({
      pathname: '/',
      search: '',
      hash: '',
    }, false, {
      prop10: 'prop10 from topPageProps',
      prop11: 'prop11 from topPageProps',
      prop15: 'prop15 from topPageProps',
    })
    const replace2 = replaceLocation({
      pathname: '/news',
      search: '',
      hash: '',
    }, ['prop10', 'prop11'], {
      prop11: 'prop11 from newsPageProps',
      prop12: 'prop12 from newsPageProps',
    })
    const replace3 = replaceLocation({
      pathname: '/news/latest',
      search: '',
      hash: '',
    }, false, {
      prop11: 'prop11 from newsLatestPageProps',
      prop12: 'prop12 from newsLatestPageProps',
    })
    const state1 = reducer(state0, replace1)
    const state2 = reducer(state1, replace2)
    const state3 = reducer(state2, replace3)
    expect(state3.page).to.deep.equal({
      location: {
        pathname: '/news/latest',
        search: '',
        hash: '',
      },
      variables: {
        prop11: 'prop11 from newsLatestPageProps',
        prop12: 'prop12 from newsLatestPageProps',
      },
      lastPageViewSent: undefined,
    })
    expect(state3.prevPages).to.deep.equal([])
  })
})

describe('popLocation', () => {
  it('failover', () => {
    const state = { ...initialState }
    const action = popLocation()
    expect(reducer(state, action)).to.deep.equal(initialState)
  })

  it('pop after push', () => {
    const state = { ...secondState }
    const action = popLocation()
    expect(reducer(state, action)).to.deep.equal(secondState)
  })

  it('pop after push+push', () => {
    const state = { ...thirdState }
    const action = popLocation()
    expect(reducer(state, action)).to.deep.equal(secondState)
  })

  it('pop after push 3 times', () => {
    const state0 = { ...initialState }
    const push1 = pushLocation({
      pathname: '/',
      search: '',
      hash: '',
    }, false, {
      prop10: 'prop10 from topPageProps',
      prop11: 'prop11 from topPageProps',
      prop15: 'prop15 from topPageProps',
    })
    const push2 = pushLocation({
      pathname: '/news',
      search: '',
      hash: '',
    }, ['prop10', 'prop11'], {
      prop11: 'prop11 from newsPageProps',
      prop12: 'prop12 from newsPageProps',
    })
    const push3 = pushLocation({
      pathname: '/news/latest',
      search: '',
      hash: '',
    }, true)
    const pop = popLocation()
    const state1 = reducer(state0, push1)
    const state2 = reducer(state1, push2)
    const state3 = reducer(state2, push3)
    const state4 = reducer(state3, pop)
    const state5 = reducer(state4, pop)
    expect(state4).to.deep.equal(state2)
    expect(state4.prevPages[0]).to.deep.equal(state1.page)
    expect(state5).to.deep.equal(state1)
  })
})
