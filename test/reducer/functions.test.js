import { describe, it } from 'mocha'
import { expect } from 'chai'
import rewire from 'rewire'

const target = rewire('../../src/reducer.js')

const inheritVariables = target.__get__('inheritVariables')

describe('inheritVariables', () => {
  it('default', () => {
    const variables = inheritVariables({
      prop10: 'prop10 from topPageProps',
      prop11: 'prop11 from topPageProps',
      prop20: 'prop20 from topPageProps',
      prop30: 'prop30 from topPageProps',
    }, {}, false)
    expect(variables).to.deep.equal({
      prop10: 'prop10 from topPageProps',
      prop11: 'prop11 from topPageProps',
      prop20: 'prop20 from topPageProps',
      prop30: 'prop30 from topPageProps',
    })
  })

  it('inherits = false', () => {
    const variables = inheritVariables({
      prop11: 'prop11 from newsPageProps',
      prop12: 'prop12 from newsPageProps',
      prop21: 'prop21 from newsPageProps',
      prop30: 'prop30 from newsPageProps',
      prop31: 'prop31 from newsPageProps',
      prop32: 'prop32 from newsPageProps',
    }, {
      variables: {
        prop10: 'prop10 from topPageProps',
        prop11: 'prop11 from topPageProps',
        prop20: 'prop20 from topPageProps',
        prop30: 'prop30 from topPageProps',
      },
    }, false)
    expect(variables).to.deep.equal({
      prop11: 'prop11 from newsPageProps',
      prop12: 'prop12 from newsPageProps',
      prop21: 'prop21 from newsPageProps',
      prop30: 'prop30 from newsPageProps',
      prop31: 'prop31 from newsPageProps',
      prop32: 'prop32 from newsPageProps',
    })
  })

  it('inherits = true', () => {
    const variables = inheritVariables({
      prop11: 'prop11 from newsPageProps',
      prop12: 'prop12 from newsPageProps',
      prop21: 'prop21 from newsPageProps',
      prop30: 'prop30 from newsPageProps',
      prop31: 'prop31 from newsPageProps',
      prop32: 'prop32 from newsPageProps',
    }, {
      variables: {
        prop10: 'prop10 from topPageProps',
        prop11: 'prop11 from topPageProps',
        prop20: 'prop20 from topPageProps',
        prop30: 'prop30 from topPageProps',
      },
    }, true)
    expect(variables).to.deep.equal({
      prop10: 'prop10 from topPageProps',  // inherit
      // prop11: 'prop11 from topPageProps', // inherit but overriden
      prop20: 'prop20 from topPageProps', // inherit
      // prop30: 'prop30 from topPageProps', // inherit but overriden
      prop11: 'prop11 from newsPageProps',
      prop12: 'prop12 from newsPageProps',
      prop21: 'prop21 from newsPageProps',
      prop30: 'prop30 from newsPageProps',
      prop31: 'prop31 from newsPageProps',
      prop32: 'prop32 from newsPageProps',
    })
  })

  it('inherits = array', () => {
    const variables = inheritVariables({
      prop11: 'prop11 from newsPageProps',
      prop12: 'prop12 from newsPageProps',
      prop21: 'prop21 from newsPageProps',
      prop30: 'prop30 from newsPageProps',
      prop31: 'prop31 from newsPageProps',
      prop32: 'prop32 from newsPageProps',
    }, {
      variables: {
        prop10: 'prop10 from topPageProps',
        prop11: 'prop11 from topPageProps',
        prop20: 'prop20 from topPageProps',
        prop30: 'prop30 from topPageProps',
      },
    }, ['prop10', 'prop11'])
    expect(variables).to.deep.equal({
      prop10: 'prop10 from topPageProps',
      // prop11: 'prop11 from topPageProps', // inherit but overridden
      // prop20: 'prop20 from topPageProps', // do not inherit
      // prop30: 'prop30 from topPageProps', // do not inherit
      prop11: 'prop11 from newsPageProps',
      prop12: 'prop12 from newsPageProps',
      prop21: 'prop21 from newsPageProps',
      prop30: 'prop30 from newsPageProps',
      prop31: 'prop31 from newsPageProps',
      prop32: 'prop32 from newsPageProps',
    })
  })
})
