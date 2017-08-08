import { describe, it } from 'mocha'
import { expect } from 'chai'
import { snapshotPageProps, PAGE_SNAPSHOT_PROPS,
 } from '../../src/actions'

describe('snapshotPageProps', () => {
  it('default', () => {
    const props = {
      data11: 'data11 from newsPageProps',
      data12: 'data12 from newsPageProps',
      data21: 'data21 from newsPageProps',
    }
    const action = snapshotPageProps(props)
    expect(action).to.deep.equal({
      type: PAGE_SNAPSHOT_PROPS,
      payload: {
        props: { ...props },
      },
    })
  })
})
