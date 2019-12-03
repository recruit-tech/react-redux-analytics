import 'jsdom-global/register'
import { describe, it } from 'mocha'
import { expect } from 'chai'
import React from 'react'
import { Provider, createStore } from 'redux'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { SEND_PAGE_VIEW } from '../../src/actions'
import sendAnalytics from '../../src/sendAnalytics'
import { topPageProps } from '../_data/props'
import { staticVariables } from '../_data/variables'
import { mockState1 } from '../_data/state'
import {
  mapPropsToVariables1,
  mapPropsToVariables2,
} from '../_data/mapFunction'
import MockComponent from '../_data/component'
import { noStaticVariables, withStaticVariables } from '../_data/hocOutput'
import { pageViewPayloadMixins } from '../_data/mixins'

configure({ adapter: new Adapter() })

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

const mountComponent = ({
  options,
  initialState,
  reducer,
  onDispatched,
  initialProps,
}) => {
  let store
  let Component
  let dispatch
  let wrapper
  const promise = new Promise((resolve, reject) => {
    store = createStore(reducer, initialState)
    dispatch = onDispatched(resolve, reject)
    Component = sendAnalytics(options)(MockComponent)
    // FXIME: enzyme は New Context API に対応していない
    // refs: https://github.com/airbnb/enzyme/issues/1553
    wrapper = mount(
      <Component {...initialProps} />,
      <Provider store={Object.assign({}, store, { dispatch })} />
    )
  })
  return { store, Component, wrapper, promise }
}

const resolveAfter = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
const rejectAfter = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject()
    }, ms)
  })

// FXIME: enzyme は New Context API に対応しておらず，テストコードが動かない #17
// refs: https://github.com/airbnb/enzyme/issues/1553
describe.skip('sendPageViewOnDidMount=false', () => {
  let count
  let options
  let reducer
  let initialState
  let initialProps
  let onDispatched

  beforeEach(() => {
    count = 0
    options = {}
    reducer = (state) => ({ ...state })
    initialState = {}
    initialProps = {}
  })

  const expectNotCalled = (resolve, reject) => (action) => {
    // confirm sendPageView is not sent
    count++
    expect.fail('action should not be dispatched')
    reject()
  }

  it('sendPageViewOnDidUpdate=true', () => {
    options = {
      sendPageViewOnDidMount: false,
      sendPageViewOnDidUpdate: true,
      mapPropsToVariables: mapPropsToVariables1,
      mixins: true,
    }
    initialState = {}
    initialProps = {}
    reducer = (state, action) => ({ ...state, ...action.payload })
    onDispatched = (resolve, reject) => (action) => {
      if (count === 0) {
        expectAction(noStaticVariables.mapPropsToVariables1[','], true)(action)
      } else if (count === 1) {
        expectAction(noStaticVariables.mapPropsToVariables1['props,'], true)(
          action
        )
        resolve()
      }
      count++
    }
    const { wrapper, promise, store } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    // confirm sendPageView is not dispatched yet
    expect(count).to.equal(0)
    wrapper.setProps(wrapper.props()) // just no update
    expect(count).to.equal(1)
    wrapper.setProps(topPageProps) // no update again
    expect(count).to.equal(2)
    store.dispatch({ type: 'any', payload: { ...mockState1 } })
    // confirm sendPageView is not dispatched yet
    expect(count).to.equal(2)
    return promise
  })

  it('sendPageViewOnDidUpdate=false', () => {
    options = {
      sendPageViewOnDidMount: false,
      sendPageViewOnDidUpdate: false,
    }
    onDispatched = expectNotCalled
    const { wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    // confirm sendPageView is not dispatched yet
    expect(count).to.equal(0)
    wrapper.setProps(topPageProps)
    wrapper.setProps({ ready: false })
    wrapper.setProps({ ready: true })
    wrapper.setProps({})
    // confirm sendPageView is not dispatched even after prop changed
    expect(count).to.equal(0)
    return Promise.race([promise, resolveAfter(800), rejectAfter(1000)])
  })

  it('sendPageViewOnDidUpdate=()=>true', () => {
    options = {
      sendPageViewOnDidMount: false,
      sendPageViewOnDidUpdate: () => true,
      mapPropsToVariables: mapPropsToVariables2,
      mixins: pageViewPayloadMixins,
      ...staticVariables,
    }
    initialState = {}
    initialProps = {}
    reducer = (state, action) => ({ ...state, ...action.payload })
    onDispatched = (resolve, reject) => (action) => {
      if (count === 0) {
        expectAction(
          withStaticVariables.mapPropsToVariables2[','],
          pageViewPayloadMixins
        )(action)
      } else if (count === 1) {
        expectAction(
          withStaticVariables.mapPropsToVariables2['props,'],
          pageViewPayloadMixins
        )(action)
      } else if (count === 2) {
        expectAction(
          withStaticVariables.mapPropsToVariables2['props,state'],
          pageViewPayloadMixins
        )(action)
        resolve()
      }
      count++
    }
    const { wrapper, promise, store } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    // confirm sendPageView is not dispatched yet
    expect(count).to.equal(0)
    wrapper.setProps(wrapper.props()) // just no update
    expect(count).to.equal(1)
    wrapper.setProps(topPageProps) // no update again
    expect(count).to.equal(2)
    store.dispatch({ type: 'any', payload: { ...mockState1 } })
    // confirm sendPageView is not dispatched yet
    expect(count).to.equal(2)
    wrapper.setProps({}) // no update again
    expect(count).to.equal(3)
    return promise
  })

  it('sendPageViewOnDidUpdate=()=>false', () => {
    options = {
      sendPageViewOnDidMount: false,
      sendPageViewOnDidUpdate: () => false,
      mapPropsToVariables: mapPropsToVariables1,
      ...staticVariables,
    }
    onDispatched = expectNotCalled
    const { wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    // confirm sendPageView is not dispatched yet
    expect(count).to.equal(0)
    wrapper.setProps(topPageProps)
    // confirm sendPageView is not dispatched even after prop changed
    expect(count).to.equal(0)
    return Promise.race([promise, resolveAfter(800), rejectAfter(1000)])
  })

  it('sendPageViewOnDidUpdate=(prevProps, props)=>props.ready', () => {
    options = {
      sendPageViewOnDidMount: false,
      sendPageViewOnDidUpdate: (prevProps, props) => props.ready,
    }
    initialState = {}
    initialProps = { ready: false }
    reducer = (state, action) => ({ ...state, ...action.payload })
    onDispatched = (resolve, reject) => (action) => {
      expectAction(noStaticVariables.noMapFunction['*,*'])(action)
      if (count === 2) {
        resolve()
      }
      count++
    }
    const { wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    expect(count).to.equal(0)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(1)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(2)
    wrapper.setProps({ ready: false })
    wrapper.setProps({ ready: false })
    wrapper.setProps(topPageProps)
    expect(count).to.equal(2)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(3)
    return promise
  })

  it('sendPageViewOnDidUpdate=()=>(prevProps, props) => !prevProps.ready && props.ready', () => {
    options = {
      sendPageViewOnDidMount: false,
      sendPageViewOnDidUpdate: (prevProps, props, state) =>
        !prevProps.ready && props.ready,
    }
    initialState = {}
    initialProps = { ready: true }
    reducer = (state, action) => ({ ...state, ...action.payload })
    onDispatched = (resolve, reject) => (action) => {
      expectAction(noStaticVariables.noMapFunction['*,*'])(action)
      if (count === 2) {
        resolve()
      }
      count++
    }
    const { wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    expect(count).to.equal(0)
    wrapper.setProps({ ready: true })
    wrapper.setProps({ ready: false })
    expect(count).to.equal(0)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(1)
    wrapper.setProps(topPageProps)
    wrapper.setProps({ ready: true })
    wrapper.setProps({ ready: true })
    wrapper.setProps({ ready: false })
    wrapper.setProps({ ready: false })
    expect(count).to.equal(1)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(2)
    wrapper.setProps({ ready: null })
    expect(count).to.equal(2)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(3)
    return promise
  })

  it('sendPageViewOnDidUpdate=(prevProps, props) => prevProps.title !== props.title', () => {
    options = {
      sendPageViewOnDidMount: false,
      sendPageViewOnDidUpdate: (prevProps, props) =>
        prevProps.title !== props.title,
    }
    initialState = {}
    initialProps = { title: 'title1' }
    reducer = (state, action) => ({ ...state, ...action.payload })
    onDispatched = (resolve, reject) => (action) => {
      expectAction(noStaticVariables.noMapFunction['*,*'])(action)
      if (count === 2) {
        resolve()
      }
      count++
    }
    const { wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    expect(count).to.equal(0)
    wrapper.setProps({ title: 'title1' })
    expect(count).to.equal(0)
    wrapper.setProps({ title: 'title2' })
    expect(count).to.equal(1)
    wrapper.setProps({ content: 'content2' })
    wrapper.setProps({ title: 'title2' })
    expect(count).to.equal(1)
    wrapper.setProps({ title: 'title3' })
    expect(count).to.equal(2)
    wrapper.setProps({ title: 'title1' })
    expect(count).to.equal(3)
    return promise
  })

  it('sendPageViewOnDidUpdate=(prevProps, props, state) => state.loaded', () => {
    options = {
      sendPageViewOnDidMount: false,
      sendPageViewOnDidUpdate: (prevProps, props, state) => state.loaded,
    }
    initialState = { loaded: false }
    initialProps = { dummy: 1 }
    reducer = (state, action) => ({ ...state, ...action.payload })
    onDispatched = (resolve, reject) => (action) => {
      expectAction(noStaticVariables.noMapFunction['*,*'])(action)
      if (count === 2) {
        resolve()
      }
      count++
    }
    const { store, wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    expect(count).to.equal(0)
    wrapper.setProps({ dummy: 1 })
    store.dispatch({ type: '', payload: { loaded: true } })
    expect(count).to.equal(0)
    wrapper.setProps({ dummy: 2 })
    expect(count).to.equal(1)
    wrapper.setProps({ dummy: 1 })
    expect(count).to.equal(2)
    store.dispatch({ type: '', payload: { loaded: false } })
    wrapper.setProps({ dummy: 2 })
    store.dispatch({ type: '', payload: { loaded: false } })
    wrapper.setProps(topPageProps)
    expect(count).to.equal(2)
    store.dispatch({ type: '', payload: { loaded: true } })
    expect(count).to.equal(2)
    wrapper.setProps(topPageProps)
    expect(count).to.equal(3)
    return promise
  })

  it('sendPageViewOnDidUpdate=()=>(prevProps, props) => !prevProps.ready && props.ready && state.loaded', () => {
    options = {
      sendPageViewOnDidMount: false,
      sendPageViewOnDidUpdate: (prevProps, props, state) =>
        !prevProps.ready && props.ready && state.loaded,
    }
    initialState = { loaded: false }
    initialProps = { ready: false }
    reducer = (state, action) => ({ ...state, ...action.payload })
    onDispatched = (resolve, reject) => (action) => {
      expectAction(noStaticVariables.noMapFunction['*,*'])(action)
      if (count === 2) {
        resolve()
      }
      count++
    }
    const { store, wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    expect(count).to.equal(0)
    wrapper.setProps({ ready: true })
    store.dispatch({ type: '', payload: { loaded: true } })
    wrapper.setProps({ ready: true })
    wrapper.setProps({ ready: false })
    expect(count).to.equal(0)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(1)
    wrapper.setProps({ ready: false })
    store.dispatch({ type: '', payload: { loaded: false } })
    wrapper.setProps({ ready: true })
    store.dispatch({ type: '', payload: { loaded: true } })
    wrapper.setProps({ ready: false })
    expect(count).to.equal(1)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(2)
    store.dispatch({ type: '', payload: { loaded: false } })
    wrapper.setProps({ ready: false })
    wrapper.setProps({ ready: true })
    store.dispatch({ type: '', payload: { loaded: true } })
    wrapper.setProps({ ready: false })
    expect(count).to.equal(2)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(3)
    return promise
  })
})

describe.skip('sendPageViewOnDidMount=false, onDataReady=(props)=>props.ready', () => {
  let count
  let options
  let reducer
  let initialState
  let initialProps
  let onDispatched

  beforeEach(() => {
    count = 0
    options = {}
    reducer = (state) => ({ ...state })
    initialState = {}
    initialProps = {}
  })

  const expectNotCalled = (resolve, reject) => (action) => {
    // confirm sendPageView is not sent
    count++
    expect.fail('action should not be dispatched')
    reject()
  }

  it('sendPageViewOnDidUpdate=()=>true', () => {
    options = {
      sendPageViewOnDidMount: false,
      sendPageViewOnDidUpdate: () => true,
      onDataReady: (props) => props.ready,
    }
    initialState = {}
    initialProps = { ready: false }
    reducer = (state, action) => ({ ...state, ...action.payload })
    onDispatched = (resolve, reject) => (action) => {
      expectAction(noStaticVariables.noMapFunction['*,*'])(action)
      if (count === 2) {
        resolve()
      }
      count++
    }
    const { wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    // confirm sendPageView is not dispatched yet
    expect(count).to.equal(0)
    wrapper.setProps({ ready: false })
    expect(count).to.equal(0)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(1)
    wrapper.setProps({ ready: false })
    expect(count).to.equal(1)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(2)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(3)
    return promise
  })

  it('sendPageViewOnDidUpdate=()=>false', () => {
    options = {
      sendPageViewOnDidMount: false,
      sendPageViewOnDidUpdate: () => false,
      onDataReady: (props) => props.ready,
    }
    onDispatched = expectNotCalled
    initialProps = { ready: true }
    const { wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    // confirm sendPageView is not dispatched yet
    expect(count).to.equal(0)
    wrapper.setProps({ ready: false })
    wrapper.setProps({ ready: true })
    wrapper.setProps({ ready: true })
    wrapper.setProps(topPageProps)
    wrapper.setProps({})
    // confirm sendPageView is not dispatched even after prop changed
    expect(count).to.equal(0)
    return Promise.race([promise, resolveAfter(800), rejectAfter(1000)])
  })

  it('sendPageViewOnDidUpdate=(prevProps, props)=>props.loaded', () => {
    options = {
      sendPageViewOnDidMount: false,
      sendPageViewOnDidUpdate: (prevProps, props) => props.loaded,
      onDataReady: (props) => props.ready,
    }
    initialState = {}
    initialProps = { ready: false, loaded: false }
    reducer = (state, action) => ({ ...state, ...action.payload })
    onDispatched = (resolve, reject) => (action) => {
      expectAction(noStaticVariables.noMapFunction['*,*'])(action)
      if (count === 3) {
        resolve()
      }
      count++
    }
    const { wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    expect(count).to.equal(0)
    wrapper.setProps({ ready: true })
    wrapper.setProps({ ready: false })
    wrapper.setProps({ ready: true })
    expect(count).to.equal(0)
    wrapper.setProps({ loaded: true })
    expect(count).to.equal(1)
    wrapper.setProps({ ready: true, loaded: false })
    wrapper.setProps({ ready: false, loaded: false })
    wrapper.setProps({ ready: false, loaded: true })
    wrapper.setProps({ loaded: false })
    expect(count).to.equal(1)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(2)
    wrapper.setProps({ loaded: true, ready: true })
    expect(count).to.equal(3)
    wrapper.setProps({})
    expect(count).to.equal(4)
    return promise
  })

  it('sendPageViewOnDidUpdate=()=>(prevProps, props) => !prevProps.loaded && props.loaded', () => {
    options = {
      sendPageViewOnDidMount: false,
      sendPageViewOnDidUpdate: (prevProps, props, state) =>
        !prevProps.loaded && props.loaded,
      onDataReady: (props) => props.ready,
    }
    initialState = {}
    initialProps = { ready: false, loaded: false }
    reducer = (state, action) => ({ ...state, ...action.payload })
    onDispatched = (resolve, reject) => (action) => {
      expectAction(noStaticVariables.noMapFunction['*,*'])(action)
      if (count === 2) {
        resolve()
      }
      count++
    }
    const { wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    expect(count).to.equal(0)
    wrapper.setProps({ loaded: true })
    expect(count).to.equal(0)
    wrapper.setProps({ loaded: false, ready: true })
    expect(count).to.equal(1)
    wrapper.setProps({ ready: false })
    wrapper.setProps({ ready: true })
    wrapper.setProps({ ready: false })
    wrapper.setProps({ loaded: true })
    expect(count).to.equal(1)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(2)
    wrapper.setProps({ ready: false })
    wrapper.setProps({ loaded: false })
    wrapper.setProps({ loaded: true })
    expect(count).to.equal(2)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(3)
    return promise
  })

  it('sendPageViewOnDidUpdate=(prevProps, props) => prevProps.title !== props.title', () => {
    options = {
      sendPageViewOnDidMount: false,
      sendPageViewOnDidUpdate: (prevProps, props) =>
        prevProps.title !== props.title,
      onDataReady: (props) => props.ready,
    }
    initialState = {}
    initialProps = { title: 'title1', ready: false }
    reducer = (state, action) => ({ ...state, ...action.payload })
    onDispatched = (resolve, reject) => (action) => {
      expectAction(noStaticVariables.noMapFunction['*,*'])(action)
      if (count === 2) {
        resolve()
      }
      count++
    }
    const { wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    expect(count).to.equal(0)
    wrapper.setProps({ title: 'title1' })
    wrapper.setProps({ title: 'title2' })
    expect(count).to.equal(0)
    wrapper.setProps({ ready: true })
    expect(count).to.equal(1)
    wrapper.setProps({ content: 'content2' })
    wrapper.setProps({ title: 'title2', ready: false })
    wrapper.setProps({ title: 'title3' })
    wrapper.setProps({ title: 'title4' })
    wrapper.setProps({ title: 'title5' })
    expect(count).to.equal(1)
    wrapper.setProps({ title: 'title2', ready: true })
    expect(count).to.equal(2)
    wrapper.setProps({ title: 'title2' })
    expect(count).to.equal(2)
    wrapper.setProps({ title: 'title3' })
    expect(count).to.equal(3)
    return promise
  })

  it('sendPageViewOnDidUpdate=(prevProps, props, state) => prevProps.id !== props.id && state.loaded', () => {
    options = {
      sendPageViewOnDidMount: false,
      sendPageViewOnDidUpdate: (prevProps, props, state) =>
        prevProps.id !== props.id && state.loaded,
      onDataReady: (props) => props.ready,
    }
    initialState = { loaded: false }
    initialProps = { id: 100, clicks: 0, ready: false }
    reducer = (state, action) => ({ ...state, ...action.payload })
    onDispatched = (resolve, reject) => (action) => {
      expectAction(noStaticVariables.noMapFunction['*,*'])(action)
      if (count === 2) {
        resolve()
      }
      count++
    }
    const { store, wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    expect(count).to.equal(0)
    wrapper.setProps({ clicks: 1 })
    store.dispatch({ type: '', payload: { loaded: true } })
    wrapper.setProps({ ready: true, title: 'article-100' })
    expect(count).to.equal(0)
    wrapper.setProps({ clicks: 2 })
    store.dispatch({ type: '', payload: { loaded: false } })
    wrapper.setProps({ clicks: 3 })
    wrapper.setProps({ clicks: 4 })
    store.dispatch({ type: '', payload: { loaded: true } })
    expect(count).to.equal(0)
    wrapper.setProps({ id: 200, ready: true, title: 'article-200' })
    expect(count).to.equal(1)
    wrapper.setProps({ clicks: 5 })
    expect(count).to.equal(1)
    wrapper.setProps({ id: 100, ready: true, title: 'article-100' })
    expect(count).to.equal(2)
    wrapper.setProps({ clicks: 6 })
    store.dispatch({ type: '', payload: { loaded: false } })
    wrapper.setProps({ id: 404, ready: true, title: '', error: 'not found' })
    wrapper.setProps({ clicks: 7 })
    store.dispatch({ type: '', payload: { loaded: true } })
    expect(count).to.equal(2)
    wrapper.setProps({ id: 0, ready: true, title: 'recommended' })
    expect(count).to.equal(3)
    return promise
  })
})

describe.skip('sendPageViewOnDidMount=true, onDataReady=(props, state)=>state.loaded', () => {
  let count
  let options
  let reducer
  let initialState
  let initialProps
  let onDispatched

  beforeEach(() => {
    count = 0
    options = {}
    reducer = (state) => ({ ...state })
    initialState = {}
    initialProps = {}
  })

  it('sendPageViewOnDidUpdate=true', () => {
    options = {
      sendPageViewOnDidMount: true,
      sendPageViewOnDidUpdate: true,
      onDataReady: (props, state) => state.loaded,
      mapPropsToVariables: mapPropsToVariables2,
      mixins: pageViewPayloadMixins,
      ...staticVariables,
    }
    initialState = { loaded: false }
    initialProps = {}
    reducer = (state, action) => ({ ...state, ...action.payload })
    onDispatched = (resolve, reject) => (action) => {
      if (count === 0) {
        expectAction(
          withStaticVariables.mapPropsToVariables2[','],
          pageViewPayloadMixins
        )(action)
      } else if (count === 1) {
        expectAction(
          withStaticVariables.mapPropsToVariables2['props,'],
          pageViewPayloadMixins
        )(action)
      } else if (count === 2) {
        expectAction(
          withStaticVariables.mapPropsToVariables2['props,state'],
          pageViewPayloadMixins
        )(action)
        resolve()
      }
      count++
    }
    const { store, wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    // confirm sendPageView is not dispatched yet
    wrapper.setProps({ click: 1 })
    store.dispatch({ type: '', payload: { loaded: true } })
    expect(count).to.equal(0)
    wrapper.setProps({ click: 2 })
    expect(count).to.equal(1)
    store.dispatch({ type: '', payload: { loaded: false } })
    wrapper.setProps({ click: 3 })
    store.dispatch({ type: '', payload: { loaded: true } })
    expect(count).to.equal(1)
    wrapper.setProps(topPageProps)
    expect(count).to.equal(2)
    store.dispatch({ type: '', payload: { loaded: false } })
    store.dispatch({ type: '', payload: { loaded: true, ...mockState1 } })
    expect(count).to.equal(2)
    wrapper.setProps({ click: 3 })
    expect(count).to.equal(3)
    return promise
  })

  it('sendPageViewOnDidUpdate=(prevProps, props)=>prevProps.id !== props.id', () => {
    options = {
      sendPageViewOnDidMount: true,
      sendPageViewOnDidUpdate: (prevProps, props) => prevProps.id !== props.id,
      onDataReady: (props, state) => state.loaded,
      mapPropsToVariables: mapPropsToVariables2,
      mixins: pageViewPayloadMixins,
      ...staticVariables,
    }
    initialState = { loaded: true, id: 100 }
    initialProps = {}
    reducer = (state, action) => ({ ...state, ...action.payload })
    onDispatched = (resolve, reject) => (action) => {
      if (count === 0) {
        expectAction(
          withStaticVariables.mapPropsToVariables2[','],
          pageViewPayloadMixins
        )(action)
      } else if (count === 1) {
        expectAction(
          withStaticVariables.mapPropsToVariables2['props,'],
          pageViewPayloadMixins
        )(action)
      } else if (count === 2) {
        expectAction(
          withStaticVariables.mapPropsToVariables2['props,state'],
          pageViewPayloadMixins
        )(action)
        resolve()
      }
      count++
    }
    const { store, wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched,
    })
    expect(count).to.equal(1)
    wrapper.setProps({ click: 1 })
    store.dispatch({ type: '', payload: { loaded: false } })
    wrapper.setProps({ id: 200 })
    store.dispatch({ type: '', payload: { loaded: true } })
    expect(count).to.equal(1)
    wrapper.setProps({ id: 200, title: 'article-200', ...topPageProps })
    expect(count).to.equal(2)
    wrapper.setProps({ click: 2 })
    store.dispatch({ type: '', payload: { loaded: false } })
    wrapper.setProps({ id: 200, extra: true })
    store.dispatch({ type: '', payload: { loaded: true, extra: 'extra' } })
    wrapper.setProps({ click: 3 })
    store.dispatch({ type: '', payload: { loaded: false } })
    wrapper.setProps({ id: 300 })
    wrapper.setProps({ click: 4 })
    store.dispatch({ type: '', payload: { loaded: true, ...mockState1 } })
    expect(count).to.equal(2)
    wrapper.setProps({ id: 300, title: 'article-300' })
    expect(count).to.equal(3)
    return promise
  })
})
