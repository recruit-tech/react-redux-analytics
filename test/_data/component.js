import React from 'react'

class MockComponent extends React.Component {
  render() {
    return (<div><p>I am a mock component</p></div>)
  }
}

MockComponent.displayName = 'ThisIsMockComponent'

MockComponent['non-react-property'] = 'non react property of MockComponent'

export default MockComponent
