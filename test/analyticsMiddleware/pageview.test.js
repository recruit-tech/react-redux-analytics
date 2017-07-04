import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { reducerName } from '../../src/names'
import { sendPageView, SEND_PAGE_VIEW, replaceLocation, pushLocation } from '../../src/actions'
import reducer from '../../src/reducer'
import analyticsMiddleware from '../../src/analyticsMiddleware'
import { top, news, newsLatest } from '../_data/location'
import { mockState1 } from '../_data/state'
import { mapStateToVariables } from '../_data/mapFunction'
import { pageViewMixins, pageViewPayloadMixins } from '../_data/mixins'
import { withPageViewPayload } from '../_data/middlewareOutput'
import { pageViewVariables } from '../_data/variables'


describe('without options', () => {
  let store
  let testApply
  beforeEach(() => {
    const analytics = analyticsMiddleware({
    })
    store = createStore(combineReducers({
      [reducerName]: reducer,
      article: (state) => ({ ...state }),
      routing: (state) => ({ ...state }),
    }), mockState1, applyMiddleware(analytics))
    testApply = analytics(store)((action) => action)
  })

  it('with only variables', () => {
    const action = sendPageView(pageViewVariables)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: withPageViewPayload['[],[],*'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('with variables, mixins = array', () => {
    const action = sendPageView(pageViewVariables, pageViewPayloadMixins)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: withPageViewPayload['[],pageViewPayloadMixins,'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('with variables, mixins = true, location = top', () => {
    const action = sendPageView(pageViewVariables, true, top)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: top,
        variables: withPageViewPayload['*,true,'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('after location replace (inherits=true), with variables, mixins = false, no location', () => {
    store.dispatch(replaceLocation(newsLatest, true))
    const action = sendPageView(pageViewVariables, false)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: newsLatest,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })
})


describe('with option pageViewMixins = array', () => {
  let store
  let testApply
  beforeEach(() => {
    const analytics = analyticsMiddleware({
      pageViewMixins,
    })
    store = createStore(combineReducers({
      [reducerName]: reducer,
      article: (state) => ({ ...state }),
      routing: (state) => ({ ...state }),
    }), mockState1, applyMiddleware(analytics))
    testApply = analytics(store)((action) => action)
  })

  it('with only variables', () => {
    const action = sendPageView(pageViewVariables)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: withPageViewPayload['pageViewMixins,[],'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('with variables, mixins = array', () => {
    const action = sendPageView(pageViewVariables, pageViewPayloadMixins)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: withPageViewPayload['pageViewMixins,pageViewPayloadMixins,'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('with variables, mixins = false', () => {
    const action = sendPageView(pageViewVariables, false)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('after location push (inherits=true), with variables, mixins = true, no location', () => {
    store.dispatch(pushLocation(newsLatest, true))
    const action = sendPageView(pageViewVariables, true)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: newsLatest,
        variables: withPageViewPayload['*,true,'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })
})

describe('with option mapStateToVariables', () => {
  let store
  let testApply
  beforeEach(() => {
    const analytics = analyticsMiddleware({
      mapStateToVariables,
    })
    store = createStore(combineReducers({
      [reducerName]: reducer,
      article: (state) => ({ ...state }),
      routing: (state) => ({ ...state }),
    }), mockState1, applyMiddleware(analytics))
    testApply = analytics(store)((action) => action)
  })

  it('with only variables', () => {
    const action = sendPageView(pageViewVariables)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: withPageViewPayload['[],[],*'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('with variables, mixins = array', () => {
    const action = sendPageView(pageViewVariables, pageViewPayloadMixins)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: withPageViewPayload['[],pageViewPayloadMixins,mapStateToVariables'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('with variables, mixins = false', () => {
    const action = sendPageView(pageViewVariables, false)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('with variables, mixins = true, location=newsLatest', () => {
    const action = sendPageView(pageViewVariables, true, newsLatest)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: newsLatest,
        variables: withPageViewPayload['*,true,mapStateToVariables'],
        update: {
          location: newsLatest,
          variables: pageViewVariables,
        },
      },
    })
  })
})


describe('with option pageViewMixins = array, mapStateToVariables', () => {
  let store
  let testApply
  beforeEach(() => {
    const analytics = analyticsMiddleware({
      pageViewMixins,
      mapStateToVariables,
    })
    store = createStore(combineReducers({
      [reducerName]: reducer,
      article: (state) => ({ ...state }),
      routing: (state) => ({ ...state }),
    }), mockState1, applyMiddleware(analytics))
    testApply = analytics(store)((action) => action)
  })

  it('with only variables', () => {
    const action = sendPageView(pageViewVariables)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: withPageViewPayload['pageViewMixins,[],mapStateToVariables'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('with variables, mixins = array', () => {
    const action = sendPageView(pageViewVariables, pageViewPayloadMixins)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: withPageViewPayload['pageViewMixins,pageViewPayloadMixins,mapStateToVariables'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('with variables, mixins = false', () => {
    const action = sendPageView(pageViewVariables, false)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('with variables, mixins = true, location=newsLatest', () => {
    const action = sendPageView(pageViewVariables, true, newsLatest)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: newsLatest,
        variables: withPageViewPayload['*,true,mapStateToVariables'],
        update: {
          location: newsLatest,
          variables: pageViewVariables,
        },
      },
    })
  })
})


describe('with getLocationInStore', () => {
  let store
  let testApply
  beforeEach(() => {
    const analytics = analyticsMiddleware({
      pageViewMixins,
      mapStateToVariables,
      getLocationInStore: (state) => state.routing.locationBeforeTransitions,
    })
    store = createStore(combineReducers({
      [reducerName]: reducer,
      article: (state) => ({ ...state }),
      routing: (state) => ({ ...state }),
    }), mockState1, applyMiddleware(analytics))
    testApply = analytics(store)((action) => action)
  })

  it('no location', () => {
    const action = sendPageView(pageViewVariables, false)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: news,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('with location = top', () => {
    const action = sendPageView(pageViewVariables, false, top)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: top,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('after location push, no location', () => {
    store.dispatch(pushLocation(newsLatest, true))
    const action = sendPageView(pageViewVariables, false)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: newsLatest,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('after location push, location = top', () => {
    store.dispatch(pushLocation(newsLatest, true))
    const action = sendPageView(pageViewVariables, false, top)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: top,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('after location replace, no location', () => {
    store.dispatch(replaceLocation(newsLatest, true))
    const action = sendPageView(pageViewVariables, false)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: newsLatest,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: undefined,
          variables: pageViewVariables,
        },
      },
    })
  })

  it('after location replace, location = top', () => {
    store.dispatch(replaceLocation(newsLatest, true))
    const action = sendPageView(pageViewVariables, false, top)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: top,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      },
    })
  })
})

