import "jsdom-global/register";
import { describe, it } from "mocha";
import { expect } from "chai";
import React from "react";
import { createStore } from "redux";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { SEND_PAGE_VIEW, PAGE_SNAPSHOT_PROPS } from "../../src/actions";
import sendAnalytics from "../../src/sendAnalytics";
import { topPageProps } from "../_data/props";
import { staticVariables } from "../_data/variables";
import { mapPropsToVariables2 } from "../_data/mapFunction";
import MockComponent from "../_data/component";
import { withStaticVariables } from "../_data/hocOutput";
import { pageViewPayloadMixins } from "../_data/mixins";

configure({ adapter: new Adapter() });

/* eslint-disable callback-return */
const expectAction = (variables, mixins = []) => action => {
  expect(action).to.deep.equal({
    type: SEND_PAGE_VIEW,
    payload: {
      location: null,
      variables,
      mixins
    }
  });
};

const mountComponent = ({
  options,
  initialState,
  reducer,
  onDispatched,
  initialProps
}) => {
  let store;
  let Component;
  let dispatch;
  let wrapper;
  const promise = new Promise((resolve, reject) => {
    store = createStore(reducer, initialState);
    dispatch = onDispatched(resolve, reject);
    Component = sendAnalytics(options)(MockComponent);
    wrapper = mount(
      <Component {...initialProps} />,
      <Provider store={Object.assign({}, store, { dispatch })} />
    );
  });
  return { store, Component, wrapper, promise };
};

const resolveAfter = ms =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

describe.skip("sendPageViewOnDidMount=true, sendPageViewOnDidUpdate=false", () => {
  let count;
  let options;
  let reducer;
  let initialState;
  let initialProps;
  let onDispatched;

  beforeEach(() => {
    count = 0;
    options = {};
    reducer = state => ({ ...state });
    initialState = {};
    initialProps = {};
  });

  it("onDataReady=true, snapshotPropsOnPageView=true", () => {
    options = {
      sendPageViewOnDidMount: true,
      sendPageViewOnDidUpdate: false,
      onDataReady: true,
      mapPropsToVariables: mapPropsToVariables2,
      mixins: pageViewPayloadMixins,
      snapshotPropsOnPageView: true,
      ...staticVariables
    };
    initialState = { loaded: false };
    initialProps = { ...topPageProps };
    reducer = (state, action) => ({ ...state, ...action.payload });
    onDispatched = (resolve, reject) => action => {
      if (count === 0) {
        expect(action).to.deep.equal({
          type: PAGE_SNAPSHOT_PROPS,
          payload: {
            props: topPageProps
          }
        });
      } else if (count === 1) {
        expectAction(
          withStaticVariables.mapPropsToVariables2["props,"],
          pageViewPayloadMixins
        )(action);
        resolve();
      }
      count++;
    };
    const { promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched
    });
    expect(count).to.equal(2);
    return promise;
  });

  it("onDataReady=(props)=>props.ready, snapshotPropsOnPageView=true", () => {
    options = {
      sendPageViewOnDidMount: true,
      sendPageViewOnDidUpdate: false,
      onDataReady: props => props.ready,
      mapPropsToVariables: mapPropsToVariables2,
      mixins: pageViewPayloadMixins,
      snapshotPropsOnPageView: true,
      ...staticVariables
    };
    initialState = { loaded: false };
    initialProps = { ...topPageProps };
    reducer = (state, action) => ({ ...state, ...action.payload });
    onDispatched = (resolve, reject) => action => {
      if (count === 0) {
        expect(action).to.deep.equal({
          type: PAGE_SNAPSHOT_PROPS,
          payload: {
            props: { ...topPageProps, ready: true, click: 1 }
          }
        });
      } else if (count === 1) {
        expectAction(
          withStaticVariables.mapPropsToVariables2["props,"],
          pageViewPayloadMixins
        )(action);
        resolve();
      }
      count++;
    };
    const { wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched
    });
    // confirm sendPageView is not dispatched yet
    expect(count).to.equal(0);
    wrapper.setProps({ click: 1 });
    expect(count).to.equal(0);
    wrapper.setProps({ ready: true });
    expect(count).to.equal(2);
    return promise;
  });

  it("onDataReady=(props,state)=>state.loaded, snapshotPropsOnPageView=true", () => {
    options = {
      sendPageViewOnDidMount: true,
      sendPageViewOnDidUpdate: false,
      onDataReady: (props, state) => state.loaded,
      mapPropsToVariables: mapPropsToVariables2,
      mixins: pageViewPayloadMixins,
      snapshotPropsOnPageView: true,
      ...staticVariables
    };
    initialState = { loaded: false };
    initialProps = { ...topPageProps };
    reducer = (state, action) => ({ ...state, ...action.payload });
    onDispatched = (resolve, reject) => action => {
      if (count === 0) {
        expect(action).to.deep.equal({
          type: PAGE_SNAPSHOT_PROPS,
          payload: {
            props: {
              ...topPageProps,
              click: 2
            }
          }
        });
      } else if (count === 1) {
        expectAction(
          withStaticVariables.mapPropsToVariables2["props,"],
          pageViewPayloadMixins
        )(action);
        resolve();
      }
      count++;
    };
    const { store, wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched
    });
    // confirm sendPageView is not dispatched yet
    wrapper.setProps({ click: 1 });
    store.dispatch({ type: "", payload: { loaded: true } });
    expect(count).to.equal(0);
    wrapper.setProps({ click: 2 });
    expect(count).to.equal(2);
    return promise;
  });

  it("onDataReady=(props)=>props.ready, snapshotPropsOnPageView=(props,state)=>state.loaded", () => {
    options = {
      sendPageViewOnDidMount: true,
      sendPageViewOnDidUpdate: false,
      onDataReady: props => props.ready,
      mapPropsToVariables: mapPropsToVariables2,
      mixins: pageViewPayloadMixins,
      snapshotPropsOnPageView: true,
      ...staticVariables
    };
    initialState = { loaded: false };
    initialProps = { ...topPageProps };
    reducer = (state, action) => ({ ...state, ...action.payload });
    onDispatched = (resolve, reject) => action => {
      if (count === 0) {
        expect(action).to.deep.equal({
          type: PAGE_SNAPSHOT_PROPS,
          payload: {
            props: { ...topPageProps, ready: true, click: 2 }
          }
        });
      } else if (count === 1) {
        expectAction(
          withStaticVariables.mapPropsToVariables2["props,"],
          pageViewPayloadMixins
        )(action);
        resolve();
      }
      count++;
    };
    const { store, wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched
    });
    // confirm sendPageView is not dispatched yet
    wrapper.setProps({ click: 1 });
    store.dispatch({ type: "", payload: { loaded: true } });
    wrapper.setProps({ click: 2 });
    expect(count).to.equal(0);
    wrapper.setProps({ ready: true });
    expect(count).to.equal(2);
    return promise;
  });

  it("onDataReady=(props,state)=>state.loaded, snapshotPropsOnPageView=(props,state)=>props.ready", () => {
    options = {
      sendPageViewOnDidMount: true,
      sendPageViewOnDidUpdate: false,
      onDataReady: (props, state) => state.loaded,
      mapPropsToVariables: mapPropsToVariables2,
      mixins: pageViewPayloadMixins,
      snapshotPropsOnPageView: props => props.ready,
      ...staticVariables
    };
    initialState = { loaded: false };
    initialProps = {};
    reducer = (state, action) => ({ ...state, ...action.payload });
    onDispatched = (resolve, reject) => action => {
      if (count === 0) {
        expectAction(
          withStaticVariables.mapPropsToVariables2[","],
          pageViewPayloadMixins
        )(action);
      } else {
        reject();
      }
      count++;
    };
    const { store, wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched
    });
    // confirm sendPageView is not dispatched yet
    wrapper.setProps({ click: 1 });
    store.dispatch({ type: "", payload: { loaded: true } });
    expect(count).to.equal(0);
    wrapper.setProps({ click: 2 });
    expect(count).to.equal(1);
    wrapper.setProps({ ready: true });
    expect(count).to.equal(1);
    return Promise.race([promise, resolveAfter(300)]);
  });
});

describe.skip("sendPageViewOnDidMount=true, sendPageViewOnDidUpdate=(prevProps, props) => !prevProps.ready && props.ready", () => {
  let count;
  let options;
  let reducer;
  let initialState;
  let initialProps;
  let onDispatched;

  beforeEach(() => {
    count = 0;
    options = {};
    reducer = state => ({ ...state });
    initialState = {};
    initialProps = {};
  });

  it("onDataReady=true, snapshotPropsOnPageView=true", () => {
    options = {
      sendPageViewOnDidMount: true,
      sendPageViewOnDidUpdate: (prevProps, props) =>
        !prevProps.ready && props.ready,
      onDataReady: true,
      mapPropsToVariables: mapPropsToVariables2,
      mixins: pageViewPayloadMixins,
      snapshotPropsOnPageView: true,
      ...staticVariables
    };
    initialState = { loaded: false };
    initialProps = { ...topPageProps };
    reducer = (state, action) => ({ ...state, ...action.payload });
    onDispatched = (resolve, reject) => action => {
      if (count === 0) {
        expect(action).to.deep.equal({
          type: PAGE_SNAPSHOT_PROPS,
          payload: {
            props: {
              ...topPageProps
            }
          }
        });
      } else if (count === 1) {
        expectAction(
          withStaticVariables.mapPropsToVariables2["props,"],
          pageViewPayloadMixins
        )(action);
      } else if (count === 2) {
        expect(action).to.deep.equal({
          type: PAGE_SNAPSHOT_PROPS,
          payload: {
            props: {
              ...topPageProps,
              ready: true
            }
          }
        });
      } else if (count === 3) {
        expectAction(
          withStaticVariables.mapPropsToVariables2["props,"],
          pageViewPayloadMixins
        )(action);
        resolve();
      }
      count++;
    };
    const { wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched
    });
    expect(count).to.equal(2);
    wrapper.setProps({ ready: false });
    expect(count).to.equal(2);
    wrapper.setProps({ ready: true });
    expect(count).to.equal(4);
    return promise;
  });

  it("onDataReady=true, snapshotPropsOnPageView=state.loaded", () => {
    options = {
      sendPageViewOnDidMount: true,
      sendPageViewOnDidUpdate: (prevProps, props) =>
        !prevProps.ready && props.ready,
      onDataReady: true,
      mapPropsToVariables: mapPropsToVariables2,
      mixins: pageViewPayloadMixins,
      snapshotPropsOnPageView: (props, state) => state.loaded,
      ...staticVariables
    };
    initialState = { loaded: false };
    initialProps = { ...topPageProps };
    reducer = (state, action) => ({ ...state, ...action.payload });
    onDispatched = (resolve, reject) => action => {
      if (count === 0) {
        expectAction(
          withStaticVariables.mapPropsToVariables2["props,"],
          pageViewPayloadMixins
        )(action);
      } else if (count === 1) {
        expect(action).to.deep.equal({
          type: PAGE_SNAPSHOT_PROPS,
          payload: {
            props: {
              ...topPageProps,
              ready: true
            }
          }
        });
      } else if (count === 2) {
        expectAction(
          withStaticVariables.mapPropsToVariables2["props,"],
          pageViewPayloadMixins
        )(action);
        resolve();
      }
      count++;
    };
    const { store, wrapper, promise } = mountComponent({
      options,
      reducer,
      initialState,
      initialProps,
      onDispatched
    });
    expect(count).to.equal(1);
    wrapper.setProps({ ready: false });
    store.dispatch({ type: "", payload: { loaded: true } });
    expect(count).to.equal(1);
    wrapper.setProps({ ready: true });
    expect(count).to.equal(3);
    return promise;
  });
});
