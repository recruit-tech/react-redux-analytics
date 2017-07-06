import { describe, it } from 'mocha'
import { expect } from 'chai'
import { isServer, getDisplayName, valueOrFunction } from '../src/utils'

describe('isServer', () => {
  it('window = null', () => {
    /* eslint-disable no-undefined */
    global.window = undefined
    expect(isServer()).to.equal(true)
  })
  it('window = {}', () => {
    global.window = {}
    expect(isServer()).to.be.equal(false)
  })
})

describe('getDisplayName', () => {
  it('default', () => {
    const component = {
      displayName: 'Connect(App(Main))',
      name: 'Connect',
    }
    expect(getDisplayName(component)).to.equal('Connect(App(Main))')
  })
  it('without displayName', () => {
    const component = {
      name: 'Connect',
    }
    expect(getDisplayName(component)).to.equal('Connect')
  })
})

describe('valueOrFunction', () => {
  const arg1 = { value: 10 }
  const arg2 = { data: { x: 10, y: 20 } }
  it('static true', () => {
    const test = true
    expect(valueOrFunction(test)(arg1, arg2)).to.equal(true)
  })
  it('static false', () => {
    const test = false
    expect(valueOrFunction(test)(arg1, arg2)).to.equal(false)
  })
  it('function always returns true', () => {
    const test = () => true
    expect(valueOrFunction(test)(arg1, arg2)).to.equal(true)
  })
  it('function always returns false', () => {
    const test = () => false
    expect(valueOrFunction(test)(arg1, arg2)).to.equal(false)
  })
  it('function takes args and returns true', () => {
    const test = (u, v) => u.value === v.data.x
    expect(valueOrFunction(test)(arg1, arg2)).to.equal(true)
  })
  it('function takes args and returns false', () => {
    const test = (u, v) => u.value === v.data.y
    expect(valueOrFunction(test)(arg1, arg2)).to.equal(false)
  })
  it('function takes args and returns object', () => {
    const test = (u, v) => ({ a: u.value, b: v.data.x, c: v.data.y })
    expect(valueOrFunction(test)(arg1, arg2)).to.deep.equal({
      a: 10,
      b: 10,
      c: 20,
    })
  })
})
