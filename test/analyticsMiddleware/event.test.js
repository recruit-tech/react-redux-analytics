import { describe, it } from 'mocha'
import { expect } from 'chai'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { reducerName } from '../../src/names'
import { sendPageView, sendEvent, SEND_EVENT } from '../../src/actions'
import reducer from '../../src/reducer'
import analyticsMiddleware from '../../src/analyticsMiddleware'
import { mockState1 } from '../_data/state'
import { mapStateToVariables } from '../_data/mapFunction'
import { eventPayloadMixins, eventMixins } from '../_data/mixins'
import { withEventPayload, withEventPayloadAfterPageView } from '../_data/middlewareOutput'
import { eventVariables, pageViewVariables } from '../_data/variables'


describe('without options, before pageView', () => {
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
    const action = sendEvent(eventVariables)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['[],[],*'],
      },
    })
  })

  it('with variables, mixins = array', () => {
    const action = sendEvent(eventVariables, eventPayloadMixins)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['[],eventPayloadMixins,'],
      },
    })
  })

  it('with variables, mixins = true', () => {
    const action = sendEvent(eventVariables, true)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['*,true,'],
      },
    })
  })

  it('with variables, mixins = false', () => {
    const action = sendEvent(eventVariables, false)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['*,false,*'],
      },
    })
  })
})


describe('without options, after pageView', () => {
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
    store.dispatch(sendPageView(pageViewVariables))
  })

  it('with only variables', () => {
    const action = sendEvent(eventVariables)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['[],[],*'],
      },
    })
  })

  it('with variables, mixins = array', () => {
    const action = sendEvent(eventVariables, eventPayloadMixins)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['[],eventPayloadMixins,'],
      },
    })
  })

  it('with variables, mixins = true', () => {
    const action = sendEvent(eventVariables, true)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['*,true,'],
      },
    })
  })

  it('with variables, mixins = false', () => {
    const action = sendEvent(eventVariables, false)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['*,false,*'],
      },
    })
  })
})

describe('with option eventMixins = array, before pageView', () => {
  let store
  let testApply
  beforeEach(() => {
    const analytics = analyticsMiddleware({
      eventMixins,
    })
    store = createStore(combineReducers({
      [reducerName]: reducer,
      article: (state) => ({ ...state }),
      routing: (state) => ({ ...state }),
    }), mockState1, applyMiddleware(analytics))
    testApply = analytics(store)((action) => action)
  })

  it('with only variables', () => {
    const action = sendEvent(eventVariables)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['eventMixins,[],'],
      },
    })
  })

  it('with variables, mixins = array', () => {
    const action = sendEvent(eventVariables, eventPayloadMixins)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['eventMixins,eventPayloadMixins,'],
      },
    })
  })

  it('with variables, mixins = true', () => {
    const action = sendEvent(eventVariables, true)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['*,true,'],
      },
    })
  })

  it('with variables, mixins = false', () => {
    const action = sendEvent(eventVariables, false)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['*,false,*'],
      },
    })
  })
})

describe('with option eventMixins = array, after pageView', () => {
  let store
  let testApply
  beforeEach(() => {
    const analytics = analyticsMiddleware({
      eventMixins,
    })
    store = createStore(combineReducers({
      [reducerName]: reducer,
      article: (state) => ({ ...state }),
      routing: (state) => ({ ...state }),
    }), mockState1, applyMiddleware(analytics))
    testApply = analytics(store)((action) => action)
    store.dispatch(sendPageView(pageViewVariables))
  })

  it('with only variables', () => {
    const action = sendEvent(eventVariables)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['eventMixins,[],'],
      },
    })
  })

  it('with variables, mixins = array', () => {
    const action = sendEvent(eventVariables, eventPayloadMixins)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['eventMixins,eventPayloadMixins,'],
      },
    })
  })

  it('with variables, mixins = true', () => {
    const action = sendEvent(eventVariables, true)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['*,true,'],
      },
    })
  })

  it('with variables, mixins = false', () => {
    const action = sendEvent(eventVariables, false)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['*,false,*'],
      },
    })
  })
})

describe('with option mapStateToVariables, before pageView', () => {
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
    const action = sendEvent(eventVariables)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['[],[],*'],
      },
    })
  })

  it('with variables, mixins = array', () => {
    const action = sendEvent(eventVariables, eventPayloadMixins)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['[],eventPayloadMixins,mapStateToVariables'],
      },
    })
  })

  it('with variables, mixins = true', () => {
    const action = sendEvent(eventVariables, true)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['*,true,mapStateToVariables'],
      },
    })
  })

  it('with variables, mixins = false', () => {
    const action = sendEvent(eventVariables, false)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['*,false,*'],
      },
    })
  })
})

describe('with option mapStateToVariables, after pageView', () => {
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
    store.dispatch(sendPageView(pageViewVariables))
  })

  it('with only variables', () => {
    const action = sendEvent(eventVariables)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['[],[],*'],
      },
    })
  })

  it('with variables, mixins = array', () => {
    const action = sendEvent(eventVariables, eventPayloadMixins)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['[],eventPayloadMixins,mapStateToVariables'],
      },
    })
  })

  it('with variables, mixins = true', () => {
    const action = sendEvent(eventVariables, true)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['*,true,mapStateToVariables'],
      },
    })
  })

  it('with variables, mixins = false', () => {
    const action = sendEvent(eventVariables, false)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['*,false,*'],
      },
    })
  })
})

describe('with option eventMixins = array, mapStateToVariables, before pageView', () => {
  let store
  let testApply
  beforeEach(() => {
    const analytics = analyticsMiddleware({
      eventMixins,
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
    const action = sendEvent(eventVariables)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['eventMixins,[],mapStateToVariables'],
      },
    })
  })

  it('with variables, mixins = array', () => {
    const action = sendEvent(eventVariables, eventPayloadMixins)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['eventMixins,eventPayloadMixins,mapStateToVariables'],
      },
    })
  })

  it('with variables, mixins = true', () => {
    const action = sendEvent(eventVariables, true)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['*,true,mapStateToVariables'],
      },
    })
  })

  it('with variables, mixins = false', () => {
    const action = sendEvent(eventVariables, false)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayload['*,false,*'],
      },
    })
  })
})


describe('with option eventMixins = array, mapStateToVariables, after pageView', () => {
  let store
  let testApply
  beforeEach(() => {
    const analytics = analyticsMiddleware({
      eventMixins,
      mapStateToVariables,
    })
    store = createStore(combineReducers({
      [reducerName]: reducer,
      article: (state) => ({ ...state }),
      routing: (state) => ({ ...state }),
    }), mockState1, applyMiddleware(analytics))
    testApply = analytics(store)((action) => action)
    store.dispatch(sendPageView(pageViewVariables))
  })

  it('with only variables', () => {
    const action = sendEvent(eventVariables)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['eventMixins,[],mapStateToVariables'],
      },
    })
  })

  it('with variables, mixins = array', () => {
    const action = sendEvent(eventVariables, eventPayloadMixins)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['eventMixins,eventPayloadMixins,mapStateToVariables'],
      },
    })
  })

  it('with variables, mixins = true', () => {
    const action = sendEvent(eventVariables, true)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['*,true,mapStateToVariables'],
      },
    })
  })

  it('with variables, mixins = false', () => {
    const action = sendEvent(eventVariables, false)
    const action2 = testApply(action)
    expect(action2).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: withEventPayloadAfterPageView['*,false,*'],
      },
    })
  })
})
