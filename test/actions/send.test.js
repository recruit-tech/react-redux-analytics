import { describe, it } from 'mocha'
import { expect } from 'chai'
import { sendPageView, sendEvent, fallbackPageView,
  SEND_PAGE_VIEW, SEND_EVENT, FALLBACK_PAGEVIEW,
 } from '../../src'
import { top } from '../_data/location'
import { prop10_12, prop10and30 } from '../_data/mixins'
import { topPageVar, eventSet1 } from '../_data/variables'

describe('sendPageView', () => {
  it('top page', () => {
    const action = sendPageView(topPageVar)
    expect(action).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: topPageVar,
        mixins: [],
      },
    })
  })

  it('with mixins = array', () => {
    const action = sendPageView(topPageVar, prop10_12)
    expect(action).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: topPageVar,
        mixins: prop10_12,
      },
    })
  })

  it('with mixins = true', () => {
    const action = sendPageView(topPageVar, true)
    expect(action).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: topPageVar,
        mixins: true,
      },
    })
  })

  it('with mixins = false', () => {
    const action = sendPageView(topPageVar, false)
    expect(action).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: undefined,
        variables: topPageVar,
        mixins: false,
      },
    })
  })

  it('with location = top', () => {
    const action = sendPageView(topPageVar, prop10_12, top)
    expect(action).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: top,
        variables: topPageVar,
        mixins: prop10_12,
      },
    })
  })
})

describe('sendEvent', () => {
  it('event1', () => {
    const action = sendEvent(eventSet1)
    expect(action).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: eventSet1,
        mixins: [],
      },
    })
  })

  it('with mixins = array', () => {
    const action = sendEvent(eventSet1, prop10and30)
    expect(action).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: eventSet1,
        mixins: prop10and30,
      },
    })
  })

  it('with mixins = true', () => {
    const action = sendEvent(eventSet1, true)
    expect(action).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: eventSet1,
        mixins: true,
      },
    })
  })

  it('with mixins = false', () => {
    const action = sendEvent(eventSet1, false)
    expect(action).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: eventSet1,
        mixins: false,
      },
    })
  })
})

describe('fallbackPageView', () => {
  it('news', () => {
    const action = sendEvent(eventSet1, false)
    expect(action).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: eventSet1,
        mixins: false,
      },
    })
  })
})
