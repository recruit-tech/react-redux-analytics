Readme.md

# react-redux-analytics

Analytics middleware for React+Redux
To send metrics to tracking server (Google Analytics, Adobe Analytics), use corresponding plugins. (I will release them soon)

## Requirements
* React (15.0+)
* Redux 
* React-Redux 

## Features
* Page view tracking with custom variables
* Custom event tracking with custom variables
* Map redux state to custom variables

## Installation
```bash
npm install --save react-redux-analytics
```

## Getting Started
### 1. Register Middleware

```js
import { applyMiddleware } from 'redux'
import { analyticsMiddleware } from 'react-redux-analytics'
import { analyticsPluginMiddleware } from 'react-redux-analytics-plugin'

const enhancer = applyMiddleware(...,
    analyticsMiddleware({
      reducerName: 'analytics',
      ...
    }),
    analyticsPluginMiddleware({...})
)
```

### 2. Register Reducer
```js
import { createStore } from 'redux'
import { analyticsMiddleware } from 'react-redux-analytics'

const store = createStore(combineReducers({
  'analytics': analyticsReducer,
  ...
}), initialState, enhancer);
```

### 3. Listen location change from history  (optional)

```js
import createHistory from 'history/createBrowserHistory'
import { createLocationSubscriber } from 'react-redux-analytics'
 
const history = createHistory()
const locationSubscriber = createLocationSubscriber(store)
history.listen((location) => {
  locationSubscriber.notify(location, "replace")
})
```

### 4. Track Page View on componentDidMount
```js
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { sendAnalytics } from 'react-redux-analytics'

class NewsPage extends React.Component {
  // ...
}

export default compose(
  connect({ ... }, { ... }),
  sendAnalytics({
    pageName: 'news:top',
    prop10: '/news',
  }),
)(IndexPage)
```

### 5. Track Custom Event on Click
```js
import { sendEvent } from 'react-redux-analytics'

class NewsPage extends React.Component {
  // ...
  render(){
    const { dispatch } = this.props
    return(<div>
      ...
      <div className="button" onClick={()=>{
        dispatch(sendEvent({
          events: ['event1'],
          prop30: 'Click me',
          eVar5: 'clicked',
      }}>Click me</div>
      ...
    </div>)
  }
}
```

## API
### Core

#### `sendAnalytics`

#### `analyticsMiddleware`

#### `createLocationSubscriber`

#### Action Creators
#### `sendPageView`
#### `sendEvent`
#### `fallbackPageView`
#### `pushLocation`
#### `popLocation`
#### `replaceLocation`
#### `updateGlobalVariables`
#### `clearGlobalVariables`
#### `updatePageVariables`
#### `clearPageVariables`


