import { describe, it } from 'mocha'
import { expect } from 'chai'
import { pushLocation, popLocation, replaceLocation,
  LOCATION_PUSH, LOCATION_POP, LOCATION_REPLACE,
 } from '../../src'
import { top } from '../_data/location'
import { prop10_12 } from '../_data/mixins'
import { propSet1 } from '../_data/variables'

describe('pushLocation', () => {
  it('push to top', () => {
    const action = pushLocation(top)
    expect(action).to.deep.equal({
      type: LOCATION_PUSH,
      payload: {
        location: top,
        variables: {},
        inherits: false,
      },
    })
  })
  it('with inherits = true', () => {
    const action = pushLocation(top, true)
    expect(action).to.deep.equal({
      type: LOCATION_PUSH,
      payload: {
        location: top,
        variables: {},
        inherits: true,
      },
    })
  })
  it('with inherits = array', () => {
    const action = pushLocation(top, prop10_12)
    expect(action).to.deep.equal({
      type: LOCATION_PUSH,
      payload: {
        location: top,
        variables: {},
        inherits: prop10_12,
      },
    })
  })
  it('with variables', () => {
    const action = pushLocation(top, false, propSet1)
    expect(action).to.deep.equal({
      type: LOCATION_PUSH,
      payload: {
        location: top,
        variables: propSet1,
        inherits: false,
      },
    })
  })
})

describe('popLocation', () => {
  it('default', () => {
    const action = popLocation()
    expect(action).to.deep.equal({
      type: LOCATION_POP,
      payload: {
      },
    })
  })
})

describe('replaceLocation', () => {
  it('replace to top', () => {
    const action = replaceLocation(top)
    expect(action).to.deep.equal({
      type: LOCATION_REPLACE,
      payload: {
        location: top,
        variables: {},
        inherits: false,
      },
    })
  })
  it('with inherits = true', () => {
    const action = replaceLocation(top, true)
    expect(action).to.deep.equal({
      type: LOCATION_REPLACE,
      payload: {
        location: top,
        variables: {},
        inherits: true,
      },
    })
  })
  it('with inherits = array', () => {
    const action = replaceLocation(top, prop10_12)
    expect(action).to.deep.equal({
      type: LOCATION_REPLACE,
      payload: {
        location: top,
        variables: {},
        inherits: prop10_12,
      },
    })
  })
  it('with variables', () => {
    const action = replaceLocation(top, false, propSet1)
    expect(action).to.deep.equal({
      type: LOCATION_REPLACE,
      payload: {
        location: top,
        variables: propSet1,
        inherits: false,
      },
    })
  })
})
