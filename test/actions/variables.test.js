import { describe, it } from 'mocha'
import { expect } from 'chai'
import { clearGlobalVariables, updateGlobalVariables,
  clearPageVariables, updatePageVariables,
  GLOBAL_VARIABLES_CLEAR, GLOBAL_VARIABLES_UPDATE,
  PAGE_VARIABLES_CLEAR, PAGE_VARIABLES_UPDATE,
 } from '../../src/actions'

describe('updateGlobalVariables', () => {
  it('default', () => {
    const action = updateGlobalVariables({
      prop30: 'prop30 from globalProp1',
      prop31: 'prop31 from globalProp1',
    })
    expect(action).to.deep.equal({
      type: GLOBAL_VARIABLES_UPDATE,
      payload: {
        variables: {
          prop30: 'prop30 from globalProp1',
          prop31: 'prop31 from globalProp1',
        },
      },
    })
  })
})

describe('clearGlobalVariables', () => {
  it('default', () => {
    const action = clearGlobalVariables()
    expect(action).to.deep.equal({
      type: GLOBAL_VARIABLES_CLEAR,
      payload: {},
    })
  })
})

describe('updatePageVariable', () => {
  it('default', () => {
    const action = updatePageVariables({
      prop20: 'prop20 from pageProp1',
      prop30: 'prop30 from pageProp1',
    })
    expect(action).to.deep.equal({
      type: PAGE_VARIABLES_UPDATE,
      payload: {
        variables: {
          prop20: 'prop20 from pageProp1',
          prop30: 'prop30 from pageProp1',
        },
      },
    })
  })
})

describe('clearPageVariable', () => {
  it('default', () => {
    const action = clearPageVariables()
    expect(action).to.deep.equal({
      type: PAGE_VARIABLES_CLEAR,
      payload: {},
    })
  })
})
