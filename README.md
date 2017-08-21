[![Build Status](https://travis-ci.org/recruit-tech/react-redux-analytics.svg?branch=master)](https://travis-ci.org/recruit-tech/react-redux-analytics)
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

### Higher-order component

#### `sendAnalytics()`
SendAnalytics HoC decorates a React component and provides it with the ability to dispatch SEND_PAGE_VIEW action when the component is mounted or updated.
```typescript
sendAnalytics(options: {
  sendPageViewOnDidMount?: boolean | ((props: Object, state: Object) => boolean);
  sendPageViewOnDidUpdate?: boolean | (( prevProps: Object, props: Object, state: Object) => boolean);
  mapPropsToVariables?: (props: Object, state: Object) => Object;
  onDataReady?:  boolean | ((props: Object, state: Object) => boolean);
  snapshotPropsOnPageView? : boolean | ((props: Object, state: Object) => boolean);
  mixins?: string[];
} & { [key:string]: any }) : (wrapped: React.Component) => React.Component
```
##### arguments
###### `options` (Object)
* `[sendPageViewOnDidMount]` (boolean | ((props: Object, state: Object) => boolean))
  If `true`, the decorated component dispatches `SEND_PAGE_VIEW` at `componentDidMount`. If the argument is a function, the function is evaluated at `componentDidMount` lifecycle and the action will be dispatched only if the result value is `true`.
  Default value: `true`

* `[sendPageViewOnDidUpdate]` (boolean |  (( prevProps: Object, props: Object, state: Object) => boolean))
  Similar to the above `sendPageViewOnDidMount`. The component will dispatches `SEND_PAGE_VIEW` at `componentDidUpdate` if the value is `true` or the result value of function is `true`.
   Default value: `false`

* `[mapPropsToVariables]` ((props: Object, state: Object) => Object)
  Accepts a function that maps props and redux state to tracking variables when the component dispatches `SEND_PAGE_VIEW`. The mapped tracking variables are injected in `variables` payload of `SEND_PAGE_VIEW`.
  Default value: `undefined`

* `[onDataReady]` (boolean | ((props: Object, state: Object) => boolean))
  If a function is specified, the component will delay the dispach of `SEND_PAGE_VIEW` until the result value of the function becomes `true`. The function is first evaluated just after `sendPageViewOnDidMount` and `sendPageViewOnDidUpdate` is evaluated to be true. If the the result of this function is `true`, the component dispatches action immediately. Otherwise, the function is  evaluated at every `componentWillReceiveProps` lifecycle until the result finally becomes `true`. (Note: Evaluation of any succeeding `sendPageViewOnDidUpdate` is skipped if the previous `SEND_PAGE_VIEW` dispatch is delayed and the result of corresponding `onDataReady` evaluation has not yet been `true` )
  Default value: `true`

* `[snapshotPropsOnPageView]` (boolean | ((props: Object, state: Object) => boolean))
  Evaluated everytime the component dispatches `SEND_PAGF_VIEW`. If the result is `true`, it dispatches `PAGE_SNAPSHOT_PROPS` to save the props (at the moment) in the page-scope of redux store. (Under `[store root]` -> `[analytics scope]` -> [`page`] -> [`snapshot`])
  Default value: `false`

* `[mixins]` (string[])
  Accpets an array of string to white-list keys of page-scope variables, global variables in the redux store, and global mapped variables.  This array is merged with `pageviewMixins` in `analyticsMiddleware`, forming the concluding white-list. The `analyticsMiddlware` injects whilte-listed variables into `variables` of `SEND_PAGE_VIEW` payload.
  Default value: `[]`

* `[staticVariables]` ({ [key: string]: any })
  The rest properties are regarded as static variables that are injected into every`SEND_PAGE_VIEW` payload.
  Default value: `{}`

##### Example
```js
//`/src/components/NewsPageArticle/index.js'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { sendAnalytics } from 'react-redux-analytics'
import NewsPageArticleComponent from './presentation' // presentational component

export default compose(
  connect((state, { index })=>({
    loaded: !state.article.loaded,
    articleIndex: index,
    pageIdx: state.pager.index,
    title: state.article.body.title,
    author: state.article.body.author,
    conent: state.article.body.content,
  }),
  sendAnalytics({
    sendPageViewOnDidMount: true, // always send PageView when component is mounted
    sendPageViewOnDidUpdate: (prevProps, props) => prevProps.articleIndex !== props.articleIndex, // send pageView only when readying article is changed. (not when pager is changed)
    onDataReady: (props) => props.loaded, // send PageView when the article is loaded from server
    mapPropsToVariables: (props) => ({
      'prop5': props.title,
      'prop10': props.articleIndex,
      'eVar9': props.author,
    }), // dyanamic variables to be sent with PageView
    mixins: ['evar30', 'eVar31'], // variables saved in Redux store and to be sent with PV
    pageName: 'ArticlePage', // static variable to send with PV
    channel: 'news',         // static variable to send with PV
}),
)(NewsPageArticleComponent)

```

### Redux Middleware
#### `analyticsMiddleware()`
Middleware that transform `SEND_PAGE_VIEW` and `SEND_EVENT` action before they reaches to the reducer or plugin middlewares. It extends `variables` property of the payload of each action by injecting values that come directly from analytics state of redux store, and the values that are mapped from entire redux store. The middleware can also override `location` property of `SEND_PAGE_VIEW` payload, and `eventName` property of `SEND_EVENT` payload.
```typescript
analyticsMiddleware(options : {
  reducerName?: string;
  pageViewMixins?: string[];
  eventMixins?: string[];
  mapStateToVariables?: (state: Object) => Object;
  getLocationInStore?: (state: Object) => Object;
  composeEventName?: (composedVariables: Object, state: Object) => string | null;
}) : (store: Redux.Store) => (next: function) => (action: Object) => void
```
##### arguments
###### `options` (Object)
* `[reducerName]` (string)
  Specifies the name of this middleware's reducer ( that is the same as the name of analytics state in the redux store). This value has to be equal to the alias that you have guven to`analyticsReducer` in`combineReducers` option.
  Default value: `'analytics'`

* `[pageViewMixins]` (string[])
  Accpets an array of string. This array is merged with `mixins` in `SEND_PAGE_VIEW` payload, forming the final white-list of variables. The middleware selects white-listed variables from analytics state (that are consisted of page-scope variables and global-scope variables) and mapped variable (generated by `mapStateToVariables`), and then injects them into `variables` of `SEND_PAGE_VIEW` payload.
  Default value: `[]`

* `[eventMixins]` (string[])
  Similar to `pageViewMixins`. This property is merged with `mixins`  in `SEND_EVENT` payload, and is used to extend `variables` property of `SEND_EVENT` payload.
  Default value: `[]`

* `[mapStateToVariables]` ((state: Object) => Object)
  Accepts a function that maps the state of entire redux store to variables being used to extend `variables` property of `SEND_PAGE_VIEW` and `SEND_EVENT` payload. Only values whose key are included in the mixin white-list are injected to the payload.
  Default value: `() => ({})`

* `[getLocationInStore]` ((state: Object) => Object)
  Accepts a function that maps the state of entire redux store to a `location` Object that is passed to reducer and plugin middlewares by `SEND_PAGE_VIEW` action. The middleware overrides the `location` property of the payload with the result of the function only if `location` property of the original payload is `null` and the return value is **NOT** `null`.
  Default value: `() => null`

* `[composeEventName]` ((composedVariables: Object, state: Object) => string | null)
  If a function is specified, the middleware use the return value of the function to override `eventName` property of `SEND_EVENT` payload. The function takes two arguments: `copmosedVariables` (1st argument) that are resulting `variables` composed of original payload `variables` and injected values, and `state` (2nd argument) that are the state of entire redux store. Like `getLocationInStore`, the middleware overrides property only if original property is `null` and the output value is **NOT** `null`.
  Default value: `() => null`

##### Example
```js
//'/src/redux/createStore.js'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import {analyticsReducer, analyticsMiddleware} from 'react-redux-analytics'
import { analyticsPluginMiddleware } from 'react-redux-analytics-plugin'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { articleReducer }  from './reducers'

const enhancer = applyMiddleware(
  routerMiddleware({
    /* ...routerMidlewareOptions, */
  }),
  analyticsMiddleware({
    reducerName: 'analytics', // (1) has to be equalt to the key to specify apnalyticsReducer
    pageViewMixins: ['prop40', 'prop41'], // custom variables that are always sent with page view
    eventMixins: ['pageName', 'channel'], // custom variables that are always sent with custom events
    mapStateToVariables: (state) => ({  //set router state to page view variables
    	prop40: state.routing.locationBeforeTransitions.pathname,
        prop41: state.routing.locationBeforeTransitions.search,
    }),
    getLocationInStore: (state) => state.routing.locationBeforeTransitions, //use router state instead of window.location
    composeEventName: (composedVariables, state) => `${composedVariables}/${composedVariables.events.join(',')}`, //generate eventName automatically from pathname and custom event list
  }),
  analyticsPluginMiddleware({
    /* ...pluginOptions, */
  }),
)

export default (initialState = {}) => createStore(combineReducers({
  analytics: analyticsReducer, // the key to analyticsReducer has to be the same as 'reducerName' in analyticsMiddleware option
  article: articleReducer,
  routing: routerReducer
}), initialState, enhancer)
```

### Utils

#### `createLocationSubscriber()`
Factory of a helper object (`LocationSubscriber`) that you can use with `react-router`.
`locationSubscriber` subscribes changes of `location` (, which must implement at least `[pathname, search, hash]` properties of `window.location` interface) from the routing framework, and changes page state of analytics middlewares in the redux store.
This helper is only useful if you want to utilize this middleware's complex page-scope variables management and historical page stack mechanism.

```typescript
createLocationSubscriber(options: {
  dispatch: (action: Object) => void;
}): { notify: (location: Object, action: 'pop'|'push'|'replace') => void }

```
##### arguments
###### `options` (Object)
* `dispatch` (function)
  Accepts the `dispatch` function of Redux store.

##### return
###### `locationSubscriber` (Object)
An object that has only one method `notify` that subscribes changes of location from a routing framework.

* `notify()`
 If called, one of `LOCATION_PUSH`, `LOCATION_POP`, `LOCATION_REPLACE` actions is dispatched depending on `action` argument of this callback.

 * `location` (Object) ***required**
   Specifies a location object that specifies the location (pathname, search, hash) of next page.Supposed to be informed by the routing framework.

 * `[action]` ('pop'|'push'|'replace')
   Accepts one of `'pop'`, `'push'`, or `'replace'`. If `'pop'` is specified, the `locationSubscriber` dispatches `LOCATION_POP`. And `'pop'` for `LOCATION_PUSH`, `'replace'` for `LOCATION_REPLACE`.

##### Example
````js
// '/src/app.js'
import createHistory from 'history/createBrowserHistory'
import { createLocationSubscriber } from 'react-redux-analytics'
import createStore from './redux/createStore' //described in above example

const store = createStore({})
const history = createHistory()
const locationSubscriber = createLocationSubscriber(store);

//set initial location
locationSubscriber.notify(history.location, 'pop')

// Listen for changes to the current location.
const unlisten = history.listen((location, action) => {
  locationSubscriber.notify(location, action);
  // if you do not need to use variable history, just keep 'replace' the page stack as follows
  // locationSubscriber.notify(location, 'replace')
});

````


### Action Creators
The following action creators can be used to manually send tracks or to control the middleware's state.

#### `sendPageView()`
Creates `SEND_PAGE_VIEW` action. The payload of `SEND_PAGE_VIEW` is transformed in `analyticsMiddlware`, and the transformed action is then relayed to plugin middlewares that finally creates server request to the tracking server. (Adobe analytics, GA, ...)

````typescript
sendPageView(
  location: Object = null,
  mixins: string[] = [],
  variables: { [key: string]: any } = {},
): Redux.Action
````
##### arguments

* `[location]` (Object)
  Accepts a `window.location` like object (specs is described above). If `null` is passed, the `analyticsMiddleware` tries to override the property by `page.location` property of the state, or the result of `getLocationInStore` option of the middleware. (by the respective order)
  Default value: `null`

* `[mixins]` (string[])
  Same as the `mixin` property of sendAnalytics `option`. If an array of string is specified, it is merged with `pageViewMixins` in `analyticsMiddleware` option to form a white-list of variables to be injected by`analyticsMiddlware`.
  Default value: `[]`

* `[variables]` ({ [key: string]: any })
 Specifies an object in which `key` is the name of a variable, and the `value` is the value assigned to the variable. These variables are merged with the injected variables by `analyticsMiddleware` and is sent with a PageView track.
  Default value: `{}`

#### `sendEvent()`
Creates `SEND_EVENT` action. Like `SEND_PAGE_VIEW`, `analyticsMiddleware` transforms the payload of this action and relays it to plugin middlewares.

```typescript
sendEvent(
  variables: { [key: string]: any} = {},
  mixins: string[] = [],
  eventName: string = null,
): Redux.Action
```
##### arguments
* `[variables]` ({ [key:string]: any})
  Specifies variables to be sent with `SEND_EVENT` in just the same manner as `sendPageView`. The variables are merged with injected ones by `analyticsMiddleware` and sent with an custom event track. (Custom link track in Adobe analytics)
  Default value: `{}`

* `[mixins]` (string[])
  Together with `eventMixins` in `analyticsMiddleware`, this array of string forms a white-list of variables that are injected to `variables` payload of resulting `SEND_EVENT` action.
  Default value: `[]`

* `[eventName]` (string)
  An unique name that is used to distinguish or aggregate custom events by the tracking server. If not specified, `analyticsMiddleware` tries to override the value by the result of `composeEventName` function specified at the middleware's option.

#### `pushLocation()`
Creates a `LOCATION_PUSH` action that pushes the current page-scope state to the top of internal page stack, and creates a new page-scope state.
```typescript
pushLocation(
  location: Object,
  inherits: (boolean | string[]) = false,
  variables: {[key:string]: any} = {}
)
```
##### arguments

* `location` (Object) ***required**
  Specifies a `window.location` like object. This value is stored in page-scope state of the middleware, and overrides the result of `getLocationInStore` property of `anallyticsMiddleware` option.

* `[inherits]` (boolean | string[])
  Accepts a boolean value or a string array. If true, `variables` property of the page-scope state is copied to the new page-scope state. If a string array is specified, only the variables whose name is included in the array are copied. Otherwise, the new page-scope state is created with a blank (`{}`) variable set.
  Defaul value: `false`

* `[variables]` ({[key:string]: any})
  If specified, the object is used as the initial value of `variables` property of new page-scope state. If `inherits` is not false, the inherited variables will be merged with this.
  Default value: `{}`

#### `popLocation()`
Creates a `LOCATION_POP` action that discards the current page-scope state and restore the one from the top of stack.
```typescript
popLocation()
```

#### `replaceLocation()`
Creates a `LOCATION_REPLACE` action. This action discards the current page-scope state, and creates a new page-scope state.
```typescript
replaceLocation(
  location: Object,
  inherits: (boolean | string[]) = false,
  variables: {[key:string]: any} = {}
)
```
##### arguments

* `location` (Object) ***required**
  Same as `location` in `pushLocation`

* `[inherits]` (boolean | string[])
  Same as `inherits` in `pushLocation`

* `[variables]` ({[key:string]: any})
  Same as `variables` in `pushLocation`

#### `updateGlobalVariables()`
Creates a `GLOBAL_VARIABLES_UPDATE` action that sets or updates `variables` property of global-scope state, which is created with `{}` value when reducer is initialized, and is persistent over `LOCATION_CHANGE`, `LOCATION_POP`, `LOCATION_REPLACE` actions.

````typescript
updateGlobalVariables(
  variables: {[key: string]: any},
)
````
##### arguments

* `variables` ({[key:string]: any}) ***required**
  Specifies an object to update the `variables` property of global-scope state. If a variables with the same key already exists in the state, the value is overriden by the one specified in the argument.

#### `clearGlobalVariables()`
Creates a `GLOBAL_VARIABLES_CLEAR` action, that reset `variables` property of global-scope state to `{}`.
````typescript
clearGlobalVariables()
````

#### `updatePageVariables()`
Creates a `PAGE_VARIABLES_UPDATE` action. Like `GLOBAL_VARIABLES_UPDATE`, this action sets or updates variables in Redux store. But they are stored in the `variables` propety of **page-scope** state, so they will be cleared when any of `LOCATION_PUSH`, `LOCATION_POP`, `LOCATION_REPLACE` actions is dispatched.

````typescript
updatePageVariables(
  variables: {[key: string]: any},
)
````
##### arguments

* `variables` ({[key:string]: any}) ***required**
  Specifies an object to be stored in page-scope state, just like `variables` argument in `globalVariablesUpdate()` to page-scope state.

#### `clearPageVariables()`
  Creates a `PAGE_VARIABLES_CLEAR` action that resets the `variables` property of page-scope state. This is the counterpart to `clearGlobalVariables()`, as `updatePageVariables()` is to `updateGlobalVariables()`.

````typescript
clearPageVariables()
````
