import { describe, it } from 'mocha'
import { expect } from 'chai'
import { snapshotPageProps, replaceLocation, pushLocation, popLocation } from '../../src/actions'
import reducer from '../../src/reducer'
import { reducerName } from '../../src/names'
import { mockState1 } from '../_data/state'
import { topPageProps, newsPageProps } from '../_data/props'
import { top, news } from '../_data/location'

describe('updateGlobalVariables', () => {
  it('default', () => {
    const state = { ...mockState1[reducerName] }
    const state2 = reducer(state, snapshotPageProps(topPageProps))
    expect(state2.page.snapshot).to.deep.equal({ ...topPageProps })

    // confirm no side-effect
    expect(state2.page.variables).to.deep.equal(state.page.variables)
    expect(state2.page.location).to.deep.equal(state.page.location)
    expect(state2.page.lastPageViewSent).to.deep.equal(state.page.lastPageViewSent)
    expect(state2.initialState).to.deep.equal(state.initialState)
    expect(state2.prevPages).to.deep.equal(state.prevPages)
    expect(state2.global).to.deep.equal(state.global)
  })

  it('confirm snapshot is cleared after replaceLocation', () => {
    const state = { ...mockState1[reducerName] }
    const state2 = reducer(state, replaceLocation(top))
    const state3 = reducer(state2, snapshotPageProps(topPageProps))
    expect(state3.page.snapshot).to.deep.equal({ ...topPageProps })
    const state4 = reducer(state3, replaceLocation(news))
    expect(state4.page.snapshot).to.equal(null)
    const state5 = reducer(state4, snapshotPageProps(newsPageProps))
    expect(state5.page.snapshot).to.deep.equal({ ...newsPageProps })
  })

  it('confirm snapshot is restored after push & pop', () => {
    const state = { ...mockState1[reducerName] }
    const state2 = reducer(state, replaceLocation(top))
    const state3 = reducer(state2, snapshotPageProps(topPageProps))
    expect(state3.page.snapshot).to.deep.equal({ ...topPageProps })
    const state4 = reducer(state3, pushLocation(news))
    expect(state4.page.snapshot).to.equal(null)
    const state5 = reducer(state4, snapshotPageProps(newsPageProps))
    expect(state5.page.snapshot).to.deep.equal({ ...newsPageProps })
    const state6 = reducer(state5, popLocation())
    expect(state6.page.snapshot).to.deep.equal({ ...topPageProps })
  })
})
