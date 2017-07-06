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

/* eslint-disable callback-return */
const expectAction = (variables, mixins = []) => (action) => {
  expect(action).to.deep.equal({
    type: SEND_PAGE_VIEW,
    payload: {
      location: null,
      variables,
      mixins,
    },
  })
}

const mountComponent = ({ options, initialState, reducer, onDispatched, initialProps }) => {
  let store
  let Component
  let wrapper
  const promise = new Promise((resolve, reject) => {
    store = createStore(reducer, initialState)
    Component = sendAnalytics(options)(MockComponent)
    wrapper = mount((<Component {...initialProps} />), {
      context: { store: { ...store, dispatch: onDispatched(resolve, reject) } },
    })
  })
  return { store, Component, wrapper, promise }
}

const resolveAfter = (ms) => new Promise((resolve, reject) => {
  setTimeout(() => { resolve() }, ms)
})
const rejectAfter = (ms) => new Promise((resolve, reject) => {
  setTimeout(() => { reject() }, ms)
})

describe('basic', () => {
  let options
  let initialState
  let initialProps
  let onDispatched
  let reducer

  beforeEach(() => {
    options = {}
    reducer = (state) => ({ ...state })
    initialState = mockState1
    initialProps = topPageProps
    onDispatched = () => { expect.fail('onDispatched is not configured') }
  })

  const expectCalled = (...args) => (resolve, reject) => (action) => {
    expectAction(...args)(action)
    resolve()
  }

  it('without options', () => {
    options = {}
    onDispatched = expectCalled(noStaticVariables.noMapFunction['*,*'], [])
    const { promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    return promise
  })

  it('with staticVariables', () => {
    options = {
      ...staticVariables,
    }
    onDispatched = expectCalled(withStaticVariables.noMapFunction['*,*'], [])
    const { promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    return promise
  })

  it('with mapPropsToVariables', () => {
    options = {
      mapPropsToVariables: mapPropsToVariables2,
    }
    onDispatched = expectCalled(noStaticVariables.mapPropsToVariables2['props,state'], [])
    const { promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    return promise
  })

  it('with staticVariables, mapPropsToVariables', () => {
    options = {
      mapPropsToVariables: mapPropsToVariables1,
      ...staticVariables,
    }
    onDispatched = expectCalled(withStaticVariables.mapPropsToVariables1['props,state'], [])
    const { promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    return promise
  })

  it('with staticVariables, mixins = true', () => {
    options = {
      mixins: true,
      ...staticVariables,
    }
    onDispatched = expectCalled(withStaticVariables.noMapFunction['*,*'], true)
    const { promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    return promise
  })

  it('with mapPropsToVariables, state = {} , mixins = false', () => {
    options = {
      mapPropsToVariables: mapPropsToVariables2,
      mixins: false,
    }
    initialState = { }
    onDispatched = expectCalled(noStaticVariables.mapPropsToVariables2['props,'], false)
    const { promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    return promise
  })

  it('with staticVariables, mapPropsToVariables, props = {}, mixins = array', () => {
    options = {
      mapPropsToVariables: mapPropsToVariables2,
      mixins: pageViewPayloadMixins,
      ...staticVariables,
    }
    initialProps = { }
    onDispatched = expectCalled(withStaticVariables.mapPropsToVariables2[',state'], pageViewPayloadMixins)
    const { promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    return promise
  })
})

describe('onDataReady', () => {
  let dispatched
  let options
  let reducer
  let initialState
  let initialProps
  let onDispatched

  beforeEach(() => {
    dispatched = false
    options = {}
    reducer = (state) => ({ ...state })
    initialState = {}
    initialProps = {}
  })

  const expectCalled = (...args) => (resolve, reject) => (action) => {
    dispatched = true
    expectAction(...args)(action)
    resolve()
  }

  const expectNotCalled = (resolve, reject) => (action) => {
    // confirm sendPageView is not sent
    dispatched = true
    expect.fail('action should not be dispatched')
    reject()
  }

  it('true', () => {
    options = {
      onDataReady: true,
      ...staticVariables,
    }
    initialState = mockState1
    initialProps = topPageProps
    onDispatched = expectCalled(withStaticVariables.noMapFunction['*,*'], [])
    const { promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    // confirm sendPageView is sent immediately
    expect(dispatched).to.equal(true)
    return promise
  })

  it('false', () => {
    options = {
      onDataReady: false,
      ...staticVariables,
    }
    initialState = mockState1
    initialProps = topPageProps
    onDispatched = expectNotCalled
    const { promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    return Promise.race([promise, resolveAfter(800), rejectAfter(1000)])
  })

  it('()=>true', () => {
    options = {
      onDataReady: () => true,
      mapPropsToVariables: mapPropsToVariables1,
      ...staticVariables,
    }
    initialState = mockState1
    initialProps = topPageProps
    onDispatched = expectCalled(withStaticVariables.mapPropsToVariables1['props,state'], [])
    const { promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    // confirm sendPageView is sent immediately
    expect(dispatched).to.equal(true)
    return promise
  })

  it('()=>false', () => {
    options = {
      onDataReady: () => false,
      ...staticVariables,
    }
    initialState = mockState1
    initialProps = topPageProps
    onDispatched = expectNotCalled
    const { wrapper, promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    wrapper.setProps(topPageProps)
    // confirm sendPageView is not dispatched even after prop changed
    expect(dispatched).to.equal(false)
    return Promise.race([promise, resolveAfter(800), rejectAfter(1000)])
  })

  it('(props)=>props.ready', () => {
    options = {
      onDataReady: (props) => props.ready,
      mapPropsToVariables: mapPropsToVariables2,
      ...staticVariables,
    }
    initialState = {}
    initialProps = topPageProps
    onDispatched = expectCalled(withStaticVariables.mapPropsToVariables2['props,'], [])
    const { wrapper, promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    wrapper.setProps({ ...topPageProps, ready: true })
    // confirm sendPageView is dispatched when props changed
    expect(dispatched).to.equal(true)
    return promise
  })

  it('(props,state)=>state.loaded', () => {
    options = {
      onDataReady: (props, state) => state.loaded,
      mapPropsToVariables: mapPropsToVariables2,
      ...staticVariables,
    }
    initialState = { loaded: false }
    initialProps = { }
    reducer = (state, action) =>
     (action.type === 'END_LOAD' ? ({ ...mockState1, loaded: true }) : ({ ...state }))
    onDispatched = expectCalled(withStaticVariables.mapPropsToVariables2['props,state'], [])

    const { store, wrapper, promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
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
    wrapper.setProps(topPageProps)
    // confirm sendPageView is finally dispatched when props is changed
    expect(dispatched).to.equal(true)
    return promise
  })
})

describe('sendPageViewOnDidMount', () => {
  let dispatched
  let options
  let reducer
  let initialState
  let initialProps
  let onDispatched

  beforeEach(() => {
    dispatched = false
    options = {}
    reducer = (state) => ({ ...state })
    initialState = {}
    initialProps = {}
  })

  const expectCalled = (...args) => (resolve, reject) => (action) => {
    dispatched = true
    expectAction(...args)(action)
    resolve()
  }

  const expectNotCalled = (resolve, reject) => (action) => {
    // confirm sendPageView is not sent
    dispatched = true
    expect.fail('action should not be dispatched')
    reject()
  }

  it('true', () => {
    initialState = mockState1
    options = {
      sendPageViewOnDidMount: true,
      mapPropsToVariables: mapPropsToVariables1,
      ...staticVariables,
    }
    onDispatched = expectCalled(withStaticVariables.mapPropsToVariables1[',state'], [])
    const { promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    // confirm sendPageView is sent
    expect(dispatched).to.equal(true)
    return promise
  })

  it('false', () => {
    options = {
      sendPageViewOnDidMount: false,
      ...staticVariables,
    }
    onDispatched = expectNotCalled
    const { wrapper, promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    wrapper.setProps(topPageProps)
    // confirm sendPageView is not dispatched even after prop changed
    expect(dispatched).to.equal(false)
    return Promise.race([promise, resolveAfter(800), rejectAfter(1000)])
  })

  it('()=>true', () => {
    initialState = mockState1
    initialProps = topPageProps
    options = {
      sendPageViewOnDidMount: () => true,
      mapPropsToVariables: mapPropsToVariables1,
    }
    onDispatched = expectCalled(noStaticVariables.mapPropsToVariables1['props,state'], [])
    const { promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    // confirm sendPageView is sent
    expect(dispatched).to.equal(true)
    return promise
  })

  it('()=>false', () => {
    options = {
      sendPageViewOnDidMount: false,
      ...staticVariables,
    }
    onDispatched = expectNotCalled
    const { wrapper, promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    wrapper.setProps(topPageProps)
    // confirm sendPageView is not dispatched even after prop changed
    expect(dispatched).to.equal(false)
    return Promise.race([promise, resolveAfter(800), rejectAfter(1000)])
  })

  it('(props)=>props.ready, props.ready = true on mount', () => {
    initialState = mockState1
    initialProps = { ...topPageProps, ready: true }
    options = {
      sendPageViewOnDidMount: (props) => props.ready,
      mapPropsToVariables: mapPropsToVariables2,
    }
    onDispatched = expectCalled(noStaticVariables.mapPropsToVariables2['props,state'], [])
    const { promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    // confirm sendPageView is sent
    expect(dispatched).to.equal(true)
    return promise
  })

  it('(props)=>props.ready, props.ready = false on mount', () => {
    initialState = {}
    initialProps = { ...topPageProps, ready: false }
    options = {
      sendPageViewOnDidMount: (props) => props.ready,
      mapPropsToVariables: mapPropsToVariables2,
      ...staticVariables,
    }
    onDispatched = expectNotCalled
    const { wrapper, promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    wrapper.setProps({ ...topPageProps, ready: true })
    // confirm action is not dispatched even if props changed
    expect(dispatched).to.equal(false)
    return Promise.race([promise, resolveAfter(800), rejectAfter(1000)])
  })

  it('(props)=>props.ready, onDataReady=props.ready', () => {
    initialState = {}
    initialProps = { ...topPageProps, ready: true }
    options = {
      sendPageViewOnDidMount: (props) => props.ready,
      onDataReady: (props) => props.ready,
      mapPropsToVariables: mapPropsToVariables2,
    }
    onDispatched = expectCalled(noStaticVariables.mapPropsToVariables2['props,'], [])
    const { promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    // confirm sendPageView is dispatched immediately
    expect(dispatched).to.equal(true)
    return promise
  })

  it('(props)=>props.ready, onDataReady=props.loaded, initialProps.loaded = false', () => {
    initialState = {}
    initialProps = { ready: true, loaded: false }
    options = {
      sendPageViewOnDidMount: (props) => props.ready,
      onDataReady: (props) => props.loaded,
      mapPropsToVariables: mapPropsToVariables2,
      ...staticVariables,
    }
    onDispatched = expectCalled(withStaticVariables.mapPropsToVariables2['props,'], [])
    const { wrapper, promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    wrapper.setProps({ ...topPageProps, ready: false, loaded: true })
    // confirm sendPageView is dispatched when props changed
    expect(dispatched).to.equal(true)
    return promise
  })

  it('(props, state)=>state.loaded, initialState.loaded = true', () => {
    reducer = (state, action) => (action.type === 'SET_LOADED' ?
      ({ ...mockState1, loaded: action.payload }) : ({ ...state }))
    initialState = { loaded: true }
    initialProps = {}
    options = {
      sendPageViewOnDidMount: (props, state) => state.loaded,
      onDataReady: (props) => props.ready,
      mapPropsToVariables: mapPropsToVariables2,
    }
    onDispatched = expectCalled(noStaticVariables.mapPropsToVariables2['props,state'], [])
    const { wrapper, store, promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })
    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    store.dispatch({ type: 'SET_LOADED', payload: false })
    // confirm loaded is now false
    expect(store.getState().loaded).to.equal(false)
    wrapper.setProps({ ...topPageProps, ready: true })
    // confirm sendPageView is dispatched when props changed
    expect(dispatched).to.equal(true)
    return promise
  })

  it('(props, state)=>state.loaded, initialState.loaded = false', () => {
    reducer = (state, action) => (action.type === 'SET_LOADED' ?
      ({ ...mockState1, loaded: action.payload }) : ({ ...state }))
    initialState = { loaded: false }
    initialProps = {}
    options = {
      sendPageViewOnDidMount: (props, state) => state.loaded,
      onDataReady: (props) => props.ready,
      mapPropsToVariables: mapPropsToVariables2,
    }
    onDispatched = expectNotCalled
    const { store, wrapper, promise } = mountComponent({ options, reducer, initialState, initialProps, onDispatched })

    // confirm sendPageView is not dispatched yet
    expect(dispatched).to.equal(false)
    store.dispatch({ type: 'SET_LOADED', payload: true })
    // confirm loaded is now true
    expect(store.getState().loaded).to.equal(true)
    wrapper.setProps({ ...topPageProps, ready: true })
    // confirm sendPageView is not dispathed
    expect(dispatched).to.equal(false)
    return Promise.race([promise, resolveAfter(800), rejectAfter(1000)])
  })
})
