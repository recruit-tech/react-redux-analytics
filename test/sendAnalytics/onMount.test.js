import 'jsdom-global/register'
import { describe, it } from 'mocha'
import { expect } from 'chai'
import React from 'react'
import { createStore } from 'redux'
import { mount } from 'enzyme'
import { SEND_PAGE_VIEW } from '../../src/actions'
import sendAnalytics from '../../src/sendAnalytics'
import { topPageProps, newsPageProps } from '../_data/props'
import { staticVariables } from '../_data/variables'
import { mockState1 } from '../_data/state'
import { mapPropsToVariables1, mapPropsToVariables2 } from '../_data/mapFunction'
import MockComponent from '../_data/component'
import { noStaticVariables, withStaticVariables } from '../_data/hocOutput'
import { pageViewPayloadMixins } from '../_data/mixins'

describe('basic', () => {
  let options
  let initialState
  let props
  let callback

  afterEach(() => {
    const store = createStore((state) => ({ ...state }), initialState)
    const Component = sendAnalytics(options)(MockComponent)
    mount((<Component {...props} />), {
      context: { store: { ...store, dispatch: callback } },
    })
  })

  it('without options', () => {
    options = {}
    initialState = { ...mockState1 }
    props = { ...topPageProps }
    callback = (action) => {
      expect(action).to.deep.equal({
        type: SEND_PAGE_VIEW,
        payload: {
          location: undefined,
          variables: noStaticVariables.noMapFunction['*,*'],
          mixins: [],
        },
      })
    }
  })

  it('with staticVariables', () => {
    options = {
      ...staticVariables,
    }
    initialState = { ...mockState1 }
    props = { ...topPageProps }
    callback = (action) => {
      expect(action).to.deep.equal({
        type: SEND_PAGE_VIEW,
        payload: {
          location: undefined,
          variables: withStaticVariables.noMapFunction['*,*'],
          mixins: [],
        },
      })
    }
  })


  it('with mapPropsToVariables', () => {
    options = {
      mapPropsToVariables: mapPropsToVariables2,
    }
    initialState = { ...mockState1 }
    props = { ...topPageProps }
    callback = (action) => {
      expect(action).to.deep.equal({
        type: SEND_PAGE_VIEW,
        payload: {
          location: undefined,
          variables: noStaticVariables.mapPropsToVariables2['props,state'],
          mixins: [],
        },
      })
    }
  })

  it('with staticVariables, mapPropsToVariables', () => {
    options = {
      mapPropsToVariables: mapPropsToVariables2,
      ...staticVariables,
    }
    initialState = { ...mockState1 }
    props = { ...topPageProps }
    callback = (action) => {
      expect(action).to.deep.equal({
        type: SEND_PAGE_VIEW,
        payload: {
          location: undefined,
          variables: withStaticVariables.mapPropsToVariables2['props,state'],
          mixins: [],
        },
      })
    }
  })

  it('with staticVariables, mixins = true', () => {
    options = {
      mixins: true,
      ...staticVariables,
    }
    initialState = { ...mockState1 }
    props = { ...topPageProps }
    callback = (action) => {
      expect(action).to.deep.equal({
        type: SEND_PAGE_VIEW,
        payload: {
          location: undefined,
          variables: withStaticVariables.noMapFunction['*,*'],
          mixins: true,
        },
      })
    }
  })

  it('with mapPropsToVariables, mixins = false', () => {
    options = {
      mapPropsToVariables: mapPropsToVariables2,
      mixins: false,
    }
    initialState = { }
    props = { ...topPageProps }
    callback = (action) => {
      expect(action).to.deep.equal({
        type: SEND_PAGE_VIEW,
        payload: {
          location: undefined,
          variables: noStaticVariables.mapPropsToVariables2['props,'],
          mixins: false,
        },
      })
    }
  })

  it('with staticVariables, mapPropsToVariables, mixins = array', () => {
    options = {
      mapPropsToVariables: mapPropsToVariables2,
      mixins: pageViewPayloadMixins,
      ...staticVariables,
    }
    initialState = { ...mockState1 }
    props = { }
    callback = (action) => {
      expect(action).to.deep.equal({
        type: SEND_PAGE_VIEW,
        payload: {
          location: undefined,
          variables: withStaticVariables.mapPropsToVariables2[',state'],
          mixins: pageViewPayloadMixins,
        },
      })
    }
  })
})


describe('onDataReady', () => {
  it('onDataReady=true', () => {
    let dispatched = false
    const callback = (action) => {
      expect(action).to.deep.equal({
        type: SEND_PAGE_VIEW,
        payload: {
          location: undefined,
          variables: withStaticVariables.noMapFunction['*,*'],
          mixins: [],
        },
      })
      dispatched = true
    }
    const store = createStore((state) => ({ ...state }), mockState1)
    const Component = sendAnalytics({
      onDataReady: true,
      ...staticVariables,
    })(MockComponent)
    mount((<Component {...topPageProps} />), {
      context: { store: { ...store, dispatch: callback } },
    })
    // confirm sendPageView is sent immediately
    expect(dispatched).to.equal(true)
  })

  it('onDataReady=false', (done) => {
    let dispatched = false
    const callback = (action) => {
      // confirm sendPageView is not sent
      dispatched = true
      expect.fail('action should not be dispatched')
    }
    const store = createStore((state) => ({ ...state }), mockState1)
    const Component = sendAnalytics({
      onDataReady: false,
      ...staticVariables,
    })(MockComponent)
    mount((<Component {...topPageProps} />), {
      context: { store: { ...store, dispatch: callback } },
    })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    setTimeout(() => { done() }, 800)
  }).timeout(1000)

  it('onDataReady=()=>true', () => {
    let dispatched = false
    const callback = (action) => {
      expect(action).to.deep.equal({
        type: SEND_PAGE_VIEW,
        payload: {
          location: undefined,
          variables: withStaticVariables.noMapFunction['*,*'],
          mixins: [],
        },
      })
      dispatched = true
    }
    const store = createStore((state) => ({ ...state }), mockState1)
    const Component = sendAnalytics({
      onDataReady: () => true,
      ...staticVariables,
    })(MockComponent)
    mount((<Component {...topPageProps} />), {
      context: { store: { ...store, dispatch: callback } },
    })
    // confirm sendPageView is sent immediately
    expect(dispatched).to.equal(true)
  })

  it('onDataReady=(props)=>props.ready', () => {
    let dispatched = false
    const callback = (action) => {
      expect(action).to.deep.equal({
        type: SEND_PAGE_VIEW,
        payload: {
          location: undefined,
          // confirm variables are mapped from changed props (topPageProps)
          variables: withStaticVariables.mapPropsToVariables1['props,'],
          mixins: [],
        },
      })
      dispatched = true
    }
    const store = createStore((state) => ({ ...state }), {})
    const Component = sendAnalytics({
      onDataReady: (props) => props.ready,
      ...staticVariables,
      mapPropsToVariables: mapPropsToVariables1,
    })(MockComponent)
    const wrapper = mount((<Component {...newsPageProps} ready={false} />), {
      context: { store: { ...store, dispatch: callback } },
    })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    wrapper.setProps({ ...topPageProps, ready: true })
    // confirm sendPageView is dispatched when props changed
    expect(dispatched).to.equal(true)
  })

  it('onDataReady=(props,state)=>state.loaded', () => {
    let dispatched = false
    const callback = (action) => {
      expect(action).to.deep.equal({
        type: SEND_PAGE_VIEW,
        payload: {
          location: undefined,
          // confirm variables are mapped from changed props & state (topPageProps, mockState1)
          variables: withStaticVariables.mapPropsToVariables2['props,state'],
          mixins: [],
        },
      })
      dispatched = true
    }
    const store = createStore((state, action) =>
     (action.type === 'END_LOAD' ? ({ ...mockState1, loaded: true }) : ({ ...state })),
     { loaded: false })
    const Component = sendAnalytics({
      onDataReady: (props, state) => state.loaded,
      mapPropsToVariables: mapPropsToVariables2,
      ...staticVariables,
    })(MockComponent)
    const wrapper = mount((<Component />), {
      context: { store: { ...store, dispatch: callback } },
    })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)

    // loading start
    store.dispatch({ type: 'START_LOAD' })
    // confirm state.loaded = false
    expect(store.getState().loaded).to.equal(false)
    wrapper.setProps({ ...newsPageProps })
    // confirm action is not yet dispatched because state.loaded = false
    expect(dispatched).to.equal(false)

    // confirm sendPageView is dispatched when props changed
    store.dispatch({ type: 'END_LOAD' })
    // confirm state.loaded = true
    expect(store.getState().loaded).to.equal(true)
    // confirm action is not yet dispatched because componentWillReceiveProps is not invoked
    expect(dispatched).to.equal(false)
    wrapper.setProps({ ...topPageProps })
    // confirm sendPageView is finally dispatched when props is changed
    expect(dispatched).to.equal(true)
  })
})

describe('sendOnDidMount', () => {
  let dispatched

  beforeEach(() => {
    dispatched = false
  })

  const expectSuccess = (action) => {
    expect(action).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: withStaticVariables.noMapFunction['*,*'],
        mixins: [],
      },
    })
    dispatched = true
  }
  const expectFail = (action) => {
    // confirm sendPageView is not sent
    dispatched = true
    expect.fail('action should not be dispatched')
  }

  it('sendOnDidMount=true', () => {
    const store = createStore((state) => ({ ...state }), mockState1)
    const Component = sendAnalytics({
      sendPageViewOnDidMount: true,
      ...staticVariables,
    })(MockComponent)
    mount((<Component {...topPageProps} />), {
      context: { store: { ...store, dispatch: expectSuccess } },
    })
    // confirm sendPageView is sent
    expect(dispatched).to.equal(true)
  })

  it('sendOnDidMount=false', (done) => {
    const store = createStore((state) => ({ ...state }), mockState1)
    const Component = sendAnalytics({
      sendPageViewOnDidMount: false,
      ...staticVariables,
    })(MockComponent)
    mount((<Component {...topPageProps} />), {
      context: { store: { ...store, dispatch: expectFail } },
    })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    setTimeout(() => { done() }, 800)
  }).timeout(1000)

  it('sendOnDidMount=()=>true', () => {
    const store = createStore((state) => ({ ...state }), mockState1)
    const Component = sendAnalytics({
      sendPageViewOnDidMount: () => true,
      ...staticVariables,
    })(MockComponent)
    mount((<Component {...topPageProps} />), {
      context: { store: { ...store, dispatch: expectSuccess } },
    })
    // confirm sendPageView is sent
    expect(dispatched).to.equal(true)
  })

  it('sendOnDidMount=()=>false', (done) => {
    const store = createStore((state) => ({ ...state }), mockState1)
    const Component = sendAnalytics({
      sendPageViewOnDidMount: () => false,
      ...staticVariables,
    })(MockComponent)
    mount((<Component {...topPageProps} />), {
      context: { store: { ...store, dispatch: expectFail } },
    })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    setTimeout(() => { done() }, 800)
  }).timeout(1000)

  it('sendOnDidMount=(props)=>props.ready, ready = true on mount', () => {
    const store = createStore((state) => ({ ...state }), {})
    const Component = sendAnalytics({
      sendPageViewOnDidMount: (props) => props.ready,
      ...staticVariables,
    })(MockComponent)
    mount((<Component {...topPageProps} ready={true} />), {
      context: { store: { ...store, dispatch: expectSuccess } },
    })
    // confirm sendPageView is sent immediately
    expect(dispatched).to.equal(true)
  })

  it('sendOnDidMount=(props)=>props.ready, ready = false on mount', (done) => {
    const store = createStore((state) => ({ ...state }), {})
    const Component = sendAnalytics({
      sendPageViewOnDidMount: (props) => props.ready,
      ...staticVariables,
    })(MockComponent)
    const wrapper = mount((<Component {...topPageProps} ready={false} />), {
      context: { store: { ...store, dispatch: expectFail } },
    })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    wrapper.setProps({ ...topPageProps, ready: true })
    // confirm action is not dispatched even if props changed
    expect(dispatched).to.equal(false)
    setTimeout(() => { done() }, 800)
  }).timeout(1000)

  it('sendOnDidMount=(props)=>props.ready, onDataReady=props.ready', () => {
    const store = createStore((state) => ({ ...state }), {})
    const Component = sendAnalytics({
      sendPageViewOnDidMount: (props) => props.ready,
      onDataReady: (props) => props.ready,
      ...staticVariables,
    })(MockComponent)
    mount((<Component {...topPageProps} ready={true} />), {
      context: { store: { ...store, dispatch: expectSuccess } },
    })
    // confirm sendPageView is sent immediately
    expect(dispatched).to.equal(true)
  })

  it('sendOnDidMount=(props)=>props.ready, onDataReady=props.loaded', () => {
    const store = createStore((state) => ({ ...state }), {})
    const Component = sendAnalytics({
      sendPageViewOnDidMount: (props) => props.ready,
      onDataReady: (props) => props.loaded,
      ...staticVariables,
    })(MockComponent)
    const wrapper = mount((<Component {...topPageProps} ready={true} loaded={false} />), {
      context: { store: { ...store, dispatch: expectSuccess } },
    })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    wrapper.setProps({ ...topPageProps, ready: false, loaded: true })
    // confirm sendPageView is dispatched when props changed
    expect(dispatched).to.equal(true)
  })

  it('sendOnDidMount=(props, state)=>state.loaded, initialState.loaded = true', () => {
    const store = createStore((state, action) =>
     (action.type === 'SET_LOADED' ? ({ ...mockState1, loaded: action.payload }) : ({ ...state })),
     { loaded: true })
    const Component = sendAnalytics({
      sendPageViewOnDidMount: (props, state) => state.loaded,
      onDataReady: (props) => props.ready,
      ...staticVariables,
    })(MockComponent)
    const wrapper = mount((<Component {...topPageProps} ready={false} />), {
      context: { store: { ...store, dispatch: expectSuccess } },
    })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    store.dispatch({ type: 'SET_LOADED', payload: false })
    // confirm loaded is now false
    expect(store.getState().loaded).to.equal(false)
    wrapper.setProps({ ...topPageProps, ready: true })
    // confirm sendPageView is dispatched when props changed
    expect(dispatched).to.equal(true)
  })

  it('sendOnDidMount=(props, state)=>state.loaded, initialState.loaded = false', () => {
    const store = createStore((state, action) =>
     (action.type === 'SET_LOADED' ? ({ ...mockState1, loaded: action.payload }) : ({ ...state })),
     { loaded: false })
    const Component = sendAnalytics({
      sendPageViewOnDidMount: (props, state) => state.loaded,
      onDataReady: (props) => props.ready,
      ...staticVariables,
    })(MockComponent)
    const wrapper = mount((<Component {...topPageProps} ready={false} />), {
      context: { store: { ...store, dispatch: expectFail } },
    })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    store.dispatch({ type: 'SET_LOADED', payload: true })
    // confirm loaded is now true
    expect(store.getState().loaded).to.equal(true)
    wrapper.setProps({ ...topPageProps, ready: true })
    // confirm sendPageView is not dispathed
    expect(dispatched).to.equal(false)
  })
})
