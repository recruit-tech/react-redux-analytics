import { describe, it } from 'mocha'
import { expect } from 'chai'
import { sendPageView, sendEvent, fallbackPageView, SEND_PAGE_VIEW } from '../../src/actions'
import reducer from '../../src/reducer'
import { topPageProps } from '../_data/props'

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
    snapshot: { ...topPageProps },
  },
  prevPages: [],
  initialState: false,
}

describe('sendPageView', () => {
  const pageVariables = {
    pageName: 'topPage',
    prop11: 'prop11 from pageView payload',
    prop12: 'prop12 from pageView payload',
  }

  it('default', () => {
    const state = { ...initialState }
    const action = sendPageView(pageVariables)
    const state2 = reducer(state, action)
    expect(state2.page.lastPageViewSent).to.deep.equal({
      variables: pageVariables,
      location: null,
    })
    // confirm no side effect
    expect(state2.page.variables).to.deep.equal(state.page.variables)
    expect(state2.page.snapshot).to.deep.equal(state.page.snapshot)
    expect(state2.page.location).to.deep.equal(state.page.location)
    expect(state2.initialState).to.deep.equal(state.initialState)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })

  it('with mixins = array', () => {
    const state = { ...initialState }
    const action = sendPageView(pageVariables, ['prop10', 'prop11', 'prop12'])
    const state2 = reducer(state, action)
    expect(state2.page.lastPageViewSent).to.deep.equal({
      variables: pageVariables,
      location: null,
    })
    // confirm no side effect
    expect(state2.page.variables).to.deep.equal(state.page.variables)
    expect(state2.page.snapshot).to.deep.equal(state.page.snapshot)
    expect(state2.page.location).to.deep.equal(state.page.location)
    expect(state2.initialState).to.deep.equal(state.initialState)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })

  it('with location = news', () => {
    const state = { ...initialState }
    const action = sendPageView(pageVariables, true, {
      pathname: '/news',
      search: '?keyword=election,vote',
      hash: '#10',
    })
    const state2 = reducer(state, action)
    expect(state2.page.lastPageViewSent).to.deep.equal({
      variables: pageVariables,
      location: {
        pathname: '/news',
        search: '?keyword=election,vote',
        hash: '#10',
      },
    })
    // confirm no side effect
    expect(state2.page.variables).to.deep.equal(state.page.variables)
    expect(state2.page.location).to.deep.equal(state.page.location)
    expect(state2.page.snapshot).to.deep.equal(state.page.snapshot)
    expect(state2.initialState).to.deep.equal(state.initialState)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })

  it('with update', () => {
    const state = { ...initialState }
    const locNews = {
      pathname: '/news',
      search: '?keyword=election,vote',
      hash: '#10',
    }
    const action = {
      type: SEND_PAGE_VIEW,
      payload: {
        variables: {
          pageName: 'topPage',
          prop11: 'prop11 from pageView payload',
          prop12: 'prop12 from pageView payload',
          prop10: 'prop10 from topPageProps',
          prop15: 'prop15 from topPageProps',
          prop30: 'prop30 from globalProps',
          prop31: 'prop31 from globalProps',
          prop40: 'prop40 from globalProps',
          prop41: 'prop41 from globalProps',
        },
        location: locNews,
        mixins: true,
        update: {
          variables: {
            pageName: 'topPage',
            prop11: 'prop11 from pageView payload',
            prop12: 'prop12 from pageView payload',
          },
          location: locNews,
        },
      },
    }
    const state2 = reducer(state, action)
    expect(state2.page.lastPageViewSent).to.deep.equal({
      variables: action.payload.variables,
      location: locNews,
    })
    expect(state2.page.variables).to.deep.equal({
      prop10: 'prop10 from topPageProps',
      // prop11: 'prop11 from topPageProps', //overriden
      prop15: 'prop15 from topPageProps',
      pageName: 'topPage',
      prop11: 'prop11 from pageView payload',
      prop12: 'prop12 from pageView payload',
    })
    expect(state2.page.location).to.deep.equal(locNews)
    // confirm no side effect
    expect(state2.page.snapshot).to.deep.equal(state.page.snapshot)
    expect(state2.initialState).to.deep.equal(state.initialState)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })
})

describe('sendEvent', () => {
  it('default', () => {
    const state = { ...initialState }
    const action = sendEvent({
      events: ['event1'],
      prop20: 'prop20 from event1Vars',
      prop21: 'prop21 from event1Vars',
    })
    const state2 = reducer(state, action)
    // confirm no side effect
    expect(state2.page.variables).to.deep.equal(state.page.variables)
    expect(state2.page.location).to.deep.equal(state.page.location)
    expect(state2.page.lastPageViewSent).to.deep.equal(state.page.lastPageViewSent)
    expect(state2.page.snapshot).to.deep.equal(state.page.snapshot)
    expect(state2.initialState).to.deep.equal(state.initialState)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })

  it('with mixins = array', () => {
    const state = { ...initialState }
    const action = sendEvent({
      events: ['event1'],
      prop20: 'prop20 from event1Vars',
      prop21: 'prop21 from event1Vars',
    }, ['prop10', 'prop30'])
    const state2 = reducer(state, action)
    // confirm no side effect
    expect(state2.page.variables).to.deep.equal(state.page.variables)
    expect(state2.page.location).to.deep.equal(state.page.location)
    expect(state2.page.lastPageViewSent).to.deep.equal(state.page.lastPageViewSent)
    expect(state2.page.snapshot).to.deep.equal(state.page.snapshot)
    expect(state2.initialState).to.deep.equal(state.initialState)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })

  it('with mixins = true', () => {
    const state = { ...initialState }
    const action = sendEvent({
      events: ['event1'],
      prop20: 'prop20 from event1Vars',
      prop21: 'prop21 from event1Vars',
    }, true)
    const state2 = reducer(state, action)
    // confirm no side effect
    expect(state2.page.variables).to.deep.equal(state.page.variables)
    expect(state2.page.location).to.deep.equal(state.page.location)
    expect(state2.page.lastPageViewSent).to.deep.equal(state.page.lastPageViewSent)
    expect(state2.page.snapshot).to.deep.equal(state.page.snapshot)
    expect(state2.initialState).to.deep.equal(state.initialState)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })

  it('with mixins = false', () => {
    const state = { ...initialState }
    const action = sendEvent({
      events: ['event1'],
      prop20: 'prop20 from event1Vars',
      prop21: 'prop21 from event1Vars',
    }, false)
    const state2 = reducer(state, action)
    // confirm no side effect
    expect(state2.page.variables).to.deep.equal(state.page.variables)
    expect(state2.page.location).to.deep.equal(state.page.location)
    expect(state2.page.lastPageViewSent).to.deep.equal(state.page.lastPageViewSent)
    expect(state2.page.snapshot).to.deep.equal(state.page.snapshot)
    expect(state2.initialState).to.deep.equal(state.initialState)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })
})

describe('fallbackPageView', () => {
  it('default', () => {
    const state = { ...initialState }
    const action = fallbackPageView({
      pathname: '/error',
      search: '',
      hash: '',
    })
    const state2 = reducer(state, action)
    // confirm no side effect
    expect(state2.page.variables).to.deep.equal(state.page.variables)
    expect(state2.page.location).to.deep.equal(state.page.location)
    expect(state2.page.lastPageViewSent).to.deep.equal(state.page.lastPageViewSent)
    expect(state2.page.snapshot).to.deep.equal(state.page.snapshot)
    expect(state2.initialState).to.deep.equal(state.initialState)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })
})
