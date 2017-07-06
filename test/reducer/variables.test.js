import { describe, it } from 'mocha'
import { expect } from 'chai'
import { clearGlobalVariables, updateGlobalVariables,
  clearPageVariables, updatePageVariables } from '../../src/actions'
import reducer from '../../src/reducer'

const initialState = {
  global: {
    variables: {
      prop30: 'prop30 from globalProps',
      prop31: 'prop31 from globalProps',
      prop40: 'prop40 from globalProps',
      prop41: 'prop41 from globalProps',
    },
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
    lastPageViewSent: null,
  },
  prevPages: [],
  initialState: false,
}


describe('updatePageVariables', () => {
  it('default', () => {
    const state = { ...initialState }
    const action = updatePageVariables({
      prop10: 'prop10 from topPageUpdate',
      prop20: 'prop20 from topPageProps',
      prop30: 'prop30 from topPageProps',
    })
    const state2 = reducer(state, action)
    expect(state2.page.variables).to.deep.equal({
      // prop10: 'prop10 from topPageProps',
      prop11: 'prop11 from topPageProps',
      prop15: 'prop15 from topPageProps',
      prop10: 'prop10 from topPageUpdate',
      prop20: 'prop20 from topPageProps',
      prop30: 'prop30 from topPageProps',
    })

    // confirm no side-effect
    expect(state2.page.location).to.deep.equal(state.page.location)
    expect(state2.page.lastPageViewSent).to.deep.equal(state.page.lastPageViewSent)
    expect(state2.initialState).to.deep.equal(state.initialState)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })
})


describe('clearPageVariables', () => {
  it('default', () => {
    const state = { ...initialState }
    const action = clearPageVariables()
    const state2 = reducer(state, action)
    expect(state2.page.variables).to.deep.equal({})

    // confirm no side-effect
    expect(state2.page.location).to.deep.equal(state.page.location)
    expect(state2.page.lastPageViewSent).to.deep.equal(state.page.lastPageViewSent)
    expect(state2.initialState).to.deep.equal(state.initialState)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })
})

describe('updateGlobalVariables', () => {
  it('default', () => {
    const state = { ...initialState }
    const action = updateGlobalVariables({
      prop41: 'prop41 from globalPropsUpdate',
      prop42: 'prop42 from globalPropsUpdate',
    })
    const state2 = reducer(state, action)
    expect(state2.global.variables).to.deep.equal({
      prop30: 'prop30 from globalProps',
      prop31: 'prop31 from globalProps',
      prop40: 'prop40 from globalProps',
      // prop41: 'prop41 from globalProps',
      prop41: 'prop41 from globalPropsUpdate',
      prop42: 'prop42 from globalPropsUpdate',
    })

    // confirm no side-effect
    expect(state2.page).to.deep.equal(state.page)
    expect(state2.initialState).to.deep.equal(state.initialState)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
  })
})

describe('clearGlobalVariables', () => {
  it('default', () => {
    const state = { ...initialState }
    const action = clearGlobalVariables({})
    const state2 = reducer(state, action)
    expect(state2.global.variables).to.deep.equal({})

    // confirm no side-effect
    expect(state2.page).to.deep.equal(state.page)
    expect(state2.initialState).to.deep.equal(state.initialState)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
  })
})
