import { describe, it } from 'mocha'
import { expect } from 'chai'
import rewire from 'rewire'
import { reducerName } from '../../src/names'
import { top, news, newsLatest } from '../_data/location'
import { mockState1, mockState2 } from '../_data/state'
import { pageViewVariables, eventVariables } from '../_data/variables'
import { mapStateToVariables } from '../_data/mapFunction'
import { pageViewMixins, pageViewPayloadMixins, eventMixins, eventPayloadMixins } from '../_data/mixins'
import { noPayload, withPageViewPayload, withEventPayload } from '../_data/middlewareOutput'

const target = rewire('../../src/analyticsMiddleware.js')

const composeMixinVariables = target.__get__('composeMixinVariables')
const composePageViewPayload = target.__get__('composePageViewPayload')
const composeEventPayload = target.__get__('composeEventPayload')

describe('composeMixinVariables', () => {
  it('default', () => {
    const composeMixins = composeMixinVariables(reducerName)
    expect(composeMixins([], mockState1)).to.deep.equal(
      noPayload['[],[],*']
    )
  })

  it('default mixins = [], mixins = array, without map function', () => {
    const composeMixins = composeMixinVariables(reducerName)
    expect(composeMixins(pageViewPayloadMixins, mockState1)).to.deep.equal(
      noPayload['[],pageViewPayloadMixins,']
    )
  })

  it('default mixins = [], mixins = array, with map function', () => {
    const composeMixins = composeMixinVariables(reducerName, [], mapStateToVariables)
    expect(composeMixins(pageViewPayloadMixins, mockState1)).to.deep.equal(
      noPayload['[],pageViewPayloadMixins,mapStateToVariables']
    )
  })

  it('default mixins = [], mixins = false, with map function', () => {
    const composeMixins = composeMixinVariables(reducerName, [], mapStateToVariables)
    expect(composeMixins(false, mockState1)).to.deep.equal(
      noPayload['*,false,*']
    )
  })

  it('default mixins = [], mixins = false, without map function', () => {
    const composeMixins = composeMixinVariables(reducerName, [])
    expect(composeMixins(false, mockState1)).to.deep.equal(
      noPayload['*,false,*']
    )
  })


  it('default mixins = [],  mixins = true, without map function', () => {
    const composeMixins = composeMixinVariables(reducerName, [])
    expect(composeMixins(true, mockState1)).to.deep.equal(
      noPayload['*,true,']
    )
  })

  it('default mixins = array,  mixins = [], without map function', () => {
    const composeMixins = composeMixinVariables(reducerName, pageViewMixins)
    expect(composeMixins([], mockState1)).to.deep.equal(
      noPayload['pageViewMixins,[],']
    )
  })

  it('default mixins = array,  mixins = [], with map function', () => {
    const composeMixins = composeMixinVariables(reducerName, pageViewMixins, mapStateToVariables)
    expect(composeMixins([], mockState1)).to.deep.equal(
      noPayload['pageViewMixins,[],mapStateToVariables']
    )
  })

  it('default mixins = array, mixins = array, without map function', () => {
    const composeMixins = composeMixinVariables(reducerName, pageViewMixins)
    expect(composeMixins(pageViewPayloadMixins, mockState1)).to.deep.equal(
      noPayload['pageViewMixins,pageViewPayloadMixins,']
    )
  })

  it('default mixins = array, mixins = array, with map function', () => {
    const composeMixins = composeMixinVariables(reducerName, pageViewMixins, mapStateToVariables)
    expect(composeMixins(pageViewPayloadMixins, mockState1)).to.deep.equal(
      noPayload['pageViewMixins,pageViewPayloadMixins,mapStateToVariables']
    )
  })

  it('default mixins = array, mixins = false, with map function', () => {
    const composeMixins = composeMixinVariables(reducerName, pageViewMixins, mapStateToVariables)
    expect(composeMixins(false, mockState1)).to.deep.equal(
      noPayload['*,false,*']
    )
  })

  it('default mixins = array, mixins = true, with map function', () => {
    const composeMixins = composeMixinVariables(reducerName, pageViewMixins, mapStateToVariables)
    expect(composeMixins(true, mockState1)).to.deep.equal(
      noPayload['*,true,mapStateToVariables']
    )
  })

  it('unsupported mixins type (object)', () => {
    const composeMixins = composeMixinVariables(reducerName, pageViewMixins, mapStateToVariables)
    expect(composeMixins({ prop10: true, prop20: false, prop60: true }, mockState1)).to.deep.equal(
      noPayload['pageViewMixins,[],mapStateToVariables']
    )
  })
})

describe('composePageViewPayload', () => {
  describe('no default mixins, without map function, without getLocationInStore', () => {
    let composePayload
    beforeEach(() => {
      composePayload = composePageViewPayload({
        reducerName,
        defaultMixins: [],
        mapStateToVariables: () => ({}),
        getLocationInStore: () => null,
      })
    })
    it('only variables, page.location = null', () => {
      const payload = composePayload({
        variables: pageViewVariables,
      }, mockState1)
      expect(payload).deep.equal({
        location: null,
        variables: withPageViewPayload['[],[],*'],
        update: {
          location: null,
          variables: pageViewVariables,
        },
      })
    })
    it('only variables, page.location = newsLatest', () => {
      const payload = composePayload({
        variables: pageViewVariables,
      }, mockState2)
      expect(payload).deep.equal({
        location: newsLatest,
        variables: withPageViewPayload['[],[],*'],
        update: {
          location: null,
          variables: pageViewVariables,
        },
      })
    })
    it('with location = top, page.location = newsLatest', () => {
      const payload = composePayload({
        variables: pageViewVariables,
        location: top,
      }, mockState1)
      expect(payload).deep.equal({
        location: top,
        variables: withPageViewPayload['[],[],*'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      })
    })
    it('with mixins = array', () => {
      const payload = composePayload({
        variables: pageViewVariables,
        location: top,
        mixins: pageViewPayloadMixins,
      }, mockState1)
      expect(payload).deep.equal({
        location: top,
        variables: withPageViewPayload['[],pageViewPayloadMixins,'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      })
    })
    it('with mixins = true', () => {
      const payload = composePayload({
        variables: pageViewVariables,
        location: top,
        mixins: true,
      }, mockState1)
      expect(payload).deep.equal({
        location: top,
        variables: withPageViewPayload['*,true,'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      })
    })
    it('with mixins = false', () => {
      const payload = composePayload({
        variables: pageViewVariables,
        location: top,
        mixins: false,
      }, mockState1)
      expect(payload).deep.equal({
        location: top,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      })
    })
  })
  describe('default mixins = array, without map function, without getLocationInStore', () => {
    let composePayload
    beforeEach(() => {
      composePayload = composePageViewPayload({
        reducerName,
        defaultMixins: pageViewMixins,
        mapStateToVariables: () => ({}),
        getLocationInStore: () => null,
      })
    })
    it('with mixins = []', () => {
      const payload = composePayload({
        variables: pageViewVariables,
        location: top,
        mixins: [],
      }, mockState1)
      expect(payload).deep.equal({
        location: top,
        variables: withPageViewPayload['pageViewMixins,[],'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      })
    })
    it('with mixins = array', () => {
      const payload = composePayload({
        variables: pageViewVariables,
        location: top,
        mixins: pageViewPayloadMixins,
      }, mockState1)
      expect(payload).deep.equal({
        location: top,
        variables: withPageViewPayload['pageViewMixins,pageViewPayloadMixins,'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      })
    })
    it('with mixins = true', () => {
      const payload = composePayload({
        variables: pageViewVariables,
        location: top,
        mixins: true,
      }, mockState1)
      expect(payload).deep.equal({
        location: top,
        variables: withPageViewPayload['*,true,'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      })
    })
    it('with mixins = false', () => {
      const payload = composePayload({
        variables: pageViewVariables,
        location: top,
        mixins: false,
      }, mockState1)
      expect(payload).deep.equal({
        location: top,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      })
    })
  })
  describe('default mixins = array, with map function, no getLocationInStore', () => {
    let composePayload
    beforeEach(() => {
      composePayload = composePageViewPayload({
        reducerName,
        defaultMixins: pageViewMixins,
        mapStateToVariables,
        getLocationInStore: () => null,
      })
    })
    it('with mixins = []', () => {
      const payload = composePayload({
        variables: pageViewVariables,
        location: top,
        mixins: [],
      }, mockState1)
      expect(payload).deep.equal({
        location: top,
        variables: withPageViewPayload['pageViewMixins,[],mapStateToVariables'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      })
    })
    it('with mixins = array', () => {
      const payload = composePayload({
        variables: pageViewVariables,
        location: top,
        mixins: pageViewPayloadMixins,
      }, mockState1)
      expect(payload).deep.equal({
        location: top,
        variables: withPageViewPayload['pageViewMixins,pageViewPayloadMixins,mapStateToVariables'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      })
    })
    it('with mixins = true', () => {
      const payload = composePayload({
        variables: pageViewVariables,
        location: top,
        mixins: true,
      }, mockState1)
      expect(payload).deep.equal({
        location: top,
        variables: withPageViewPayload['*,true,mapStateToVariables'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      })
    })
    it('with mixins = false', () => {
      const payload = composePayload({
        variables: pageViewVariables,
        location: top,
        mixins: false,
      }, mockState1)
      expect(payload).deep.equal({
        location: top,
        variables: withPageViewPayload['*,false,*'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      })
    })
  })

  describe('no default mixins, without map function, with getLocationInStore', () => {
    let composePayload
    beforeEach(() => {
      composePayload = composePageViewPayload({
        reducerName,
        defaultMixins: [],
        mapStateToVariables: () => ({}),
        getLocationInStore: (state) => (state.routing.locationBeforeTransitions),
      })
    })
    it('only variables, page.location = null', () => {
      const payload = composePayload({
        variables: pageViewVariables,
      }, mockState1)
      expect(payload).deep.equal({
        location: news,
        variables: withPageViewPayload['[],[],*'],
        update: {
          location: null,
          variables: pageViewVariables,
        },
      })
    })
    it('only variables, page.location = newsLatest', () => {
      const payload = composePayload({
        variables: pageViewVariables,
      }, mockState2)
      expect(payload).deep.equal({
        location: newsLatest,
        variables: withPageViewPayload['[],[],*'],
        update: {
          location: null,
          variables: pageViewVariables,
        },
      })
    })
    it('with location = top, page.location = newsLatest', () => {
      const payload = composePayload({
        variables: pageViewVariables,
        location: top,
      }, mockState1)
      expect(payload).deep.equal({
        location: top,
        variables: withPageViewPayload['[],[],*'],
        update: {
          location: top,
          variables: pageViewVariables,
        },
      })
    })
  })
})


describe('composeEventPayload', () => {
  describe('no default mixins, without map function', () => {
    let composePayload
    beforeEach(() => {
      composePayload = composeEventPayload({
        reducerName,
        defaultMixins: [],
        mapStateToVariables: () => ({}),
        composeEventName: () => null,
      })
    })
    it('only variables', () => {
      const payload = composePayload({
        variables: eventVariables,
      }, mockState1)
      expect(payload).deep.equal({
        variables: withEventPayload['[],[],*'],
        eventName: null,
      })
    })
    it('with mixins = array', () => {
      const payload = composePayload({
        variables: eventVariables,
        mixins: eventPayloadMixins,
      }, mockState1)
      expect(payload).deep.equal({
        variables: withEventPayload['[],eventPayloadMixins,'],
        eventName: null,
      })
    })
    it('with mixins = true', () => {
      const payload = composePayload({
        variables: eventVariables,
        mixins: true,
      }, mockState1)
      expect(payload).deep.equal({
        variables: withEventPayload['*,true,'],
        eventName: null,
      })
    })
    it('with mixins = false', () => {
      const payload = composePayload({
        variables: eventVariables,
        mixins: false,
      }, mockState1)
      expect(payload).deep.equal({
        variables: eventVariables,
        eventName: null,
      })
    })
  })
  describe('default mixins = array, without map function', () => {
    let composePayload
    beforeEach(() => {
      composePayload = composeEventPayload({
        reducerName,
        defaultMixins: eventMixins,
        mapStateToVariables: () => ({}),
        composeEventName: () => null,
      })
    })
    it('with mixins = []', () => {
      const payload = composePayload({
        variables: eventVariables,
        mixins: [],
      }, mockState1)
      expect(payload).deep.equal({
        variables: withEventPayload['eventMixins,[],'],
        eventName: null,
      })
    })
    it('with mixins = array', () => {
      const payload = composePayload({
        variables: eventVariables,
        mixins: eventPayloadMixins,
      }, mockState1)
      expect(payload).deep.equal({
        variables: withEventPayload['eventMixins,eventPayloadMixins,'],
        eventName: null,
      })
    })
    it('with mixins = true', () => {
      const payload = composePayload({
        variables: eventVariables,
        mixins: true,
      }, mockState1)
      expect(payload).deep.equal({
        variables: withEventPayload['*,true,'],
        eventName: null,
      })
    })
    it('with mixins = false', () => {
      const payload = composePayload({
        variables: eventVariables,
        mixins: false,
      }, mockState1)
      expect(payload).deep.equal({
        variables: withEventPayload['*,false,*'],
        eventName: null,
      })
    })
  })
  describe('default mixins = array, with map function', () => {
    let composePayload
    beforeEach(() => {
      composePayload = composeEventPayload({
        reducerName,
        defaultMixins: eventMixins,
        mapStateToVariables,
        composeEventName: () => null,
      })
    })
    it('with mixins = []', () => {
      const payload = composePayload({
        variables: eventVariables,
        mixins: [],
      }, mockState1)
      expect(payload).deep.equal({
        variables: withEventPayload['eventMixins,[],mapStateToVariables'],
        eventName: null,
      })
    })
    it('with mixins = array', () => {
      const payload = composePayload({
        variables: eventVariables,
        mixins: eventPayloadMixins,
      }, mockState1)
      expect(payload).deep.equal({
        variables: withEventPayload['eventMixins,eventPayloadMixins,mapStateToVariables'],
        eventName: null,
      })
    })
    it('with mixins = true', () => {
      const payload = composePayload({
        variables: eventVariables,
        mixins: true,
      }, mockState1)
      expect(payload).deep.equal({
        variables: withEventPayload['*,true,mapStateToVariables'],
        eventName: null,
      })
    })
    it('with mixins = false', () => {
      const payload = composePayload({
        variables: eventVariables,
        mixins: false,
      }, mockState1)
      expect(payload).deep.equal({
        variables: withEventPayload['*,false,*'],
        eventName: null,
      })
    })
  })

  describe('with composeEventName', () => {
    let composePayload
    beforeEach(() => {
      composePayload = composeEventPayload({
        reducerName,
        defaultMixins: eventMixins,
        mapStateToVariables,
        composeEventName: (composedVariables, state) =>
        `${state.article.title}:${composedVariables.prop30 || '0'}:`
        + `${composedVariables.prop40 || composedVariables.prop31 || '0'}:${composedVariables.events[0]}`,
      })
    })
    it('with mixins = []', () => {
      const payload = composePayload({
        variables: eventVariables,
        mixins: [],
      }, mockState1)
      const expectedVars = withEventPayload['eventMixins,[],mapStateToVariables']
      expect(payload).deep.equal({
        variables: expectedVars,
        eventName: `${mockState1.article.title}:0:${expectedVars.prop31}:${expectedVars.events[0]}`,
      })
    })
    it('with mixins = array', () => {
      const payload = composePayload({
        variables: eventVariables,
        mixins: eventPayloadMixins,
      }, mockState1)
      const expectedVars = withEventPayload['eventMixins,eventPayloadMixins,mapStateToVariables']
      expect(payload).deep.equal({
        variables: expectedVars,
        eventName: `${mockState1.article.title}:0:${expectedVars.prop31}:${expectedVars.events[0]}`,
      })
    })
    it('with mixins = true', () => {
      const payload = composePayload({
        variables: eventVariables,
        mixins: true,
      }, mockState1)
      const expectedVars = withEventPayload['*,true,mapStateToVariables']
      expect(payload).deep.equal({
        variables: expectedVars,
        eventName: `${mockState1.article.title}:${expectedVars.prop30}:${expectedVars.prop40}:${expectedVars.events[0]}`,
      })
    })
    it('with mixins = false', () => {
      const payload = composePayload({
        variables: eventVariables,
        mixins: false,
      }, mockState1)
      const expectedVars = withEventPayload['*,false,*']
      expect(payload).deep.equal({
        variables: expectedVars,
        eventName: `${mockState1.article.title}:0:0:${expectedVars.events[0]}`,
      })
    })
  })
})
