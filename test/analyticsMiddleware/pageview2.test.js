import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { reducerName } from '../../src/names'
import { sendPageView, SEND_PAGE_VIEW, replaceLocation } from '../../src/actions'
import reducer from '../../src/reducer'
import analyticsMiddleware from '../../src/analyticsMiddleware'
import { top, news } from '../_data/location'
import { mockState1 } from '../_data/state'
import { mapStateToVariables } from '../_data/mapFunction'
import { pageViewMixins } from '../_data/mixins'
import { withPageViewPayload } from '../_data/middlewareOutput'
import { pageViewVariables } from '../_data/variables'

describe('suppress page view', () => {
  let store
  let testApply
  beforeEach(() => {
    const analytics = analyticsMiddleware({
      pageViewMixins,
      mapStateToVariables,
      suppressPageView: (state, action) => {
        const lastPageView = state[reducerName].page.lastPageViewSent
        return lastPageView && lastPageView.location.pathname === action.payload.location.pathname
      },
    })
    store = createStore(combineReducers({
      [reducerName]: reducer,
      article: (state) => ({ ...state }),
      routing: (state) => ({ ...state }),
    }), mockState1, applyMiddleware(analytics))
    testApply = analytics(store)((action) => action)
  })

  it('dispatched at the first PageView', () => {
    store.dispatch(replaceLocation(top, true))
    const action = testApply(sendPageView(pageViewVariables, false))
    expect(action).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: top,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: null,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('suppress if location does not change', () => {
    store.dispatch(replaceLocation(top, true))
    const action = sendPageView(pageViewVariables, false)
    store.dispatch(action)
    const action2 = testApply(sendPageView(pageViewVariables, false))
    expect(action2).to.equal(null)
    const action3 = testApply(sendPageView(pageViewVariables, false))
    expect(action3).to.equal(null)
  })

  it('dispatched if location changes', () => {
    store.dispatch(replaceLocation(top, true))
    const action = sendPageView(pageViewVariables, false)
    store.dispatch(action)
    store.dispatch(replaceLocation(top, true))
    const action2 = testApply(sendPageView(pageViewVariables, false))
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: top,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: null,
          variables: pageViewVariables,
        },
      },
    })
    store.dispatch(action2)
    const action3 = testApply(sendPageView(pageViewVariables, false))
    expect(action3).to.equal(null)
  })

  it('dispatched if different location is specified in payload', () => {
    store.dispatch(replaceLocation(top, true))
    const action = sendPageView(pageViewVariables, false)
    store.dispatch(action)
    const action2 = testApply(sendPageView(pageViewVariables, false, news))
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: news,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: news,
          variables: pageViewVariables,
        },
      },
    })
    store.dispatch(action2)
    const action3 = testApply(sendPageView(pageViewVariables, false))
    expect(action3).to.equal(null)
  })
})
