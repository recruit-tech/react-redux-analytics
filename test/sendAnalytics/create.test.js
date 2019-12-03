import "jsdom-global/register";
import { describe, it } from "mocha";
import { expect } from "chai";
import React from "react";
import { createStore } from "redux";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { sendAnalyticsPropertyName } from "../../src/names";
import sendAnalytics from "../../src/sendAnalytics";
import { topPageProps } from "../_data/props";
import { mockState1 } from "../_data/state";
import MockComponent from "../_data/component";

configure({ adapter: new Adapter() });

describe.skip("default", () => {
  let Component;
  let wrapper;
  beforeEach(() => {
    const store = createStore(state => ({ ...state }), mockState1);
    Component = sendAnalytics({})(MockComponent);
    wrapper = mount(
      <Component {...topPageProps} />,
      <Provider store={store} />
    );
  });
  it("displayName", () => {
    expect(Component.displayName).to.equal(
      "SendAnalytics(ThisIsMockComponent)"
    );
    expect(wrapper.type().displayName).to.equal(
      "SendAnalytics(ThisIsMockComponent)"
    );
  });
  it("sendAnalytics property", () => {
    expect(Component[sendAnalyticsPropertyName]).to.equal(
      "SendAnalytics(ThisIsMockComponent)"
    );
    expect(wrapper.type()[sendAnalyticsPropertyName]).to.equal(
      "SendAnalytics(ThisIsMockComponent)"
    );
  });
  it("non react property of wrapped component", () => {
    expect(Component["non-react-property"]).to.equal(
      "non react property of MockComponent"
    );
    expect(wrapper.type()["non-react-property"]).to.equal(
      "non react property of MockComponent"
    );
  });
  it("store is connected", () => {
    const store = wrapper.context().store;
    expect(store).to.have.property("dispatch");
    expect(store).to.have.property("getState");
  });
  it("this.isPageViewScheduled is default false", () => {
    const instance = wrapper.instance();
    expect(instance.isPageViewScheduled).to.equal(false);
  });
});
