import { describe, it } from 'mocha'
import { expect } from 'chai'
import { sendPageView, sendEvent, fallbackPageView,
  SEND_PAGE_VIEW, SEND_EVENT, FALLBACK_PAGEVIEW,
 } from '../../src/actions'

describe('sendPageView', () => {
  it('default', () => {
    const action = sendPageView({
      pageName: 'topPage',
    })
    expect(action).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: null,
        variables: {
          pageName: 'topPage',
        },
        mixins: [],
      },
    })
  })

  it('with mixins = array', () => {
    const action = sendPageView({
      pageName: 'topPage',
    }, ['prop10', 'prop11', 'prop12'])
    expect(action).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: null,
        variables: {
          pageName: 'topPage',
        },
        mixins: ['prop10', 'prop11', 'prop12'],
      },
    })
  })

  it('with mixins = true', () => {
    const action = sendPageView({
      pageName: 'topPage',
    }, true)
    expect(action).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: null,
        variables: {
          pageName: 'topPage',
        },
        mixins: true,
      },
    })
  })

  it('with mixins = false', () => {
    const action = sendPageView({
      pageName: 'topPage',
    }, false)
    expect(action).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: null,
        variables: {
          pageName: 'topPage',
        },
        mixins: false,
      },
    })
  })

  it('with location = top', () => {
    const action = sendPageView({
      pageName: 'topPage',
    }, ['prop10', 'prop11', 'prop12'], {
      pathname: '/',
      search: '',
      hash: '',
    })
    expect(action).to.deep.equal({
      type: SEND_PAGE_VIEW,
      payload: {
        location: {
          pathname: '/',
          search: '',
          hash: '',
        },
        variables: {
          pageName: 'topPage',
        },
        mixins: ['prop10', 'prop11', 'prop12'],
      },
    })
  })
})

describe('sendEvent', () => {
  it('default', () => {
    const action = sendEvent({
      events: ['event1'],
      prop20: 'prop20 from event1Vars',
      prop21: 'prop21 from event1Vars',
    })
    expect(action).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: {
          events: ['event1'],
          prop20: 'prop20 from event1Vars',
          prop21: 'prop21 from event1Vars',
        },
        mixins: [],
      },
    })
  })

  it('with mixins = array', () => {
    const action = sendEvent({
      events: ['event1'],
      prop20: 'prop20 from event1Vars',
      prop21: 'prop21 from event1Vars',
    }, ['prop10', 'prop30'])
    expect(action).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: {
          events: ['event1'],
          prop20: 'prop20 from event1Vars',
          prop21: 'prop21 from event1Vars',
        },
        mixins: ['prop10', 'prop30'],
      },
    })
  })

  it('with mixins = true', () => {
    const action = sendEvent({
      events: ['event1'],
      prop20: 'prop20 from event1Vars',
      prop21: 'prop21 from event1Vars',
    }, true)
    expect(action).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: {
          events: ['event1'],
          prop20: 'prop20 from event1Vars',
          prop21: 'prop21 from event1Vars',
        },
        mixins: true,
      },
    })
  })

  it('with mixins = false', () => {
    const action = sendEvent({
      events: ['event1'],
      prop20: 'prop20 from event1Vars',
      prop21: 'prop21 from event1Vars',
    }, false)
    expect(action).to.deep.equal({
      type: SEND_EVENT,
      payload: {
        variables: {
          events: ['event1'],
          prop20: 'prop20 from event1Vars',
          prop21: 'prop21 from event1Vars',
        },
        mixins: false,
      },
    })
  })
})

describe('fallbackPageView', () => {
  it('default', () => {
    const action = fallbackPageView({
      pathname: '/error',
      search: '',
      hash: '',
    })
    expect(action).to.deep.equal({
      type: FALLBACK_PAGEVIEW,
      payload: {
        location: {
          pathname: '/error',
          search: '',
          hash: '',
        },
      },
    })
  })
})
