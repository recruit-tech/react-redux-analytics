import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createStore, combineReducers } from 'redux'
import { reducerName } from '../src/names'
import reducer from '../src/reducer'
import createLocationSubscriber from '../src/createLocationSubscriber'
import { top, news, newsLatest } from './_data/location'

const initialState = {
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

describe('createLocationSubscriber', () => {
  let store
  let subscriber

  beforeEach(() => {
    store = createStore(combineReducers({
      [reducerName]: reducer,
    }), { [reducerName]: initialState })
    subscriber = createLocationSubscriber(store)
  })

  it('replace at initial', () => {
    const state = { ...initialState }
    expect(store.getState()[reducerName]).to.deep.equal(state)
    subscriber.notify(top)
    const state2 = store.getState()[reducerName]
    expect(state2.page.location).to.deep.equal(top)
    expect(state2.initialState).to.deep.equal(false)
    // confirm no side effect
    expect(state2.page.variables).to.deep.equal(state.page.variables)
    expect(state2.page.lastPageViewSent).to.deep.equal(state.page.lastPageViewSent)
    expect(state2.page.snapshot).to.deep.equal(state.page.snapshot)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })

  it('push at initial', () => {
    const state = { ...initialState }
    expect(store.getState()[reducerName]).to.deep.equal(state)
    subscriber.notify(top, 'push')
    const state2 = store.getState()[reducerName]
    expect(state2.page.location).to.deep.equal(top)
    expect(state2.initialState).to.deep.equal(false)
    // confirm no side effect
    expect(state2.page.variables).to.deep.equal(state.page.variables)
    expect(state2.page.lastPageViewSent).to.deep.equal(state.page.lastPageViewSent)
    expect(state2.page.snapshot).to.deep.equal(state.page.snapshot)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })

  it('pop at initial', () => {
    const state = { ...initialState }
    expect(store.getState()[reducerName]).to.deep.equal(state)
    subscriber.notify(top, 'pop')
    const state2 = store.getState()[reducerName]
    // confirm nothing happens
    expect(state2.page.location).to.deep.equal(state.page.location)
    expect(state2.initialState).to.deep.equal(state.initialState)
    expect(state2.page.variables).to.deep.equal(state.page.variables)
    expect(state2.page.lastPageViewSent).to.deep.equal(state.page.lastPageViewSent)
    expect(state2.page.snapshot).to.deep.equal(state.page.snapshot)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })

  it('push -> push', () => {
    const state = { ...initialState }
    expect(store.getState()[reducerName]).to.deep.equal(state)
    subscriber.notify(top, 'push')
    subscriber.notify(news, 'push')
    const state2 = store.getState()[reducerName]
    expect(state2.page).to.deep.equal({
      location: news,
      variables: {},
      lastPageViewSent: null,
      snapshot: null,
    })
    expect(state2.initialState).to.deep.equal(false)
    expect(state2.prevPages).to.deep.equal([{
      location: top,
      variables: {},
      lastPageViewSent: null,
      snapshot: null,
    }])
    // confirm no side effect
    expect(state2.global).to.deep.equal(state.global)
  })

  it('push -> push -> push', () => {
    const state = { ...initialState }
    expect(store.getState()[reducerName]).to.deep.equal(state)
    subscriber.notify(top, 'push')
    subscriber.notify(news, 'push')
    subscriber.notify(newsLatest, 'push')
    const state2 = store.getState()[reducerName]
    expect(state2.page).to.deep.equal({
      location: newsLatest,
      variables: {},
      lastPageViewSent: null,
      snapshot: null,
    })
    expect(state2.initialState).to.deep.equal(false)
    expect(state2.prevPages).to.deep.equal([
      {
        location: news,
        variables: {},
        lastPageViewSent: null,
        snapshot: null,
      },
      {
        location: top,
        variables: {},
        lastPageViewSent: null,
        snapshot: null,
      }])
    // confirm no side effect
    expect(state2.global).to.deep.equal(state.global)
  })

  it('push -> push -> pop', () => {
    const state = { ...initialState }
    expect(store.getState()[reducerName]).to.deep.equal(state)
    subscriber.notify(top, 'push')
    subscriber.notify(news, 'push')
    subscriber.notify(null, 'pop')
    const state2 = store.getState()[reducerName]
    expect(state2.page).to.deep.equal({
      location: top,
      variables: {},
      lastPageViewSent: null,
      snapshot: null,
    })
    expect(state2.prevPages).to.deep.equal([])
    expect(state2.initialState).to.deep.equal(false)
    // confirm no side effect
    expect(state2.global).to.deep.equal(state.global)
  })

  it('push -> replace', () => {
    const state = { ...initialState }
    expect(store.getState()[reducerName]).to.deep.equal(state)
    subscriber.notify(top, 'push')
    subscriber.notify(news)
    const state2 = store.getState()[reducerName]
    expect(state2.page).to.deep.equal({
      location: news,
      variables: {},
      lastPageViewSent: null,
      snapshot: null,
    })
    expect(state2.initialState).to.deep.equal(false)
    expect(state2.prevPages).to.deep.equal([])
    // confirm no side effect
    expect(state2.global).to.deep.equal(state.global)
  })

  it('replace -> push', () => {
    const state = { ...initialState }
    expect(store.getState()[reducerName]).to.deep.equal(state)
    subscriber.notify(top, 'replace')
    subscriber.notify(news, 'push')
    const state2 = store.getState()[reducerName]
    expect(state2.page).to.deep.equal({
      location: news,
      variables: {},
      lastPageViewSent: null,
      snapshot: null,
    })
    expect(state2.initialState).to.deep.equal(false)
    expect(state2.prevPages).to.deep.equal([{
      location: top,
      variables: {},
      lastPageViewSent: null,
      snapshot: null,
    }])
    // confirm no side effect
    expect(state2.global).to.deep.equal(state.global)
  })

  it('replace -> pop', () => {
    const state = { ...initialState }
    expect(store.getState()[reducerName]).to.deep.equal(state)
    subscriber.notify(top, 'replace')
    subscriber.notify(null, 'pop')
    const state2 = store.getState()[reducerName]
    expect(state2.page).to.deep.equal({
      location: top,
      variables: {},
      lastPageViewSent: null,
      snapshot: null,
    })
    expect(state2.initialState).to.deep.equal(false)
    expect(state2.prevPages).to.deep.equal([])
    // confirm no side effect
    expect(state2.global).to.deep.equal(state.global)
  })
})
