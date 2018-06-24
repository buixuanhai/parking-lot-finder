import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import ui from "./reducers/ui";
import { firebaseReducer } from "react-redux-firebase";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import { reactReduxFirebase } from "react-redux-firebase";
import { Route } from "react-router";
import createHistory from "history/createBrowserHistory";
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware
} from "react-router-redux";
import Loadable from "react-loadable";
import Loading from "./components/Loading";

const App = Loadable({
  loader: () => import("./App"),
  loading: Loading
});
const StoryDetail = Loadable({
  loader: () => import("./screens/StoryDetail"),
  loading: Loading
});
const Login = Loadable({
  loader: () => import("./screens/Login"),
  loading: Loading
});

export const history = createHistory();
const historyMiddleware = routerMiddleware(history);

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const middleware = [historyMiddleware];
const enhancer = composeEnhancers(
  applyMiddleware(...middleware)
  // other store enhancers if any
);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId
};

firebase.initializeApp(firebaseConfig);

// react-redux-firebase options
const config = {
  userProfile: "users", // firebase root where user profiles are stored
  enableLogging: false, // enable/disable Firebase's database logging
  fileMetadataFactory: uploadRes => {
    const {
      metadata: { name, fullPath }
    } = uploadRes;
    return {
      name,
      fullPath
    };
  }
};

// Add redux Firebase to compose
const createStoreWithFirebase = compose(reactReduxFirebase(firebase, config))(
  createStore
);

const store = createStoreWithFirebase(
  combineReducers({
    ui,
    firebase: firebaseReducer,
    router: routerReducer
  }),
  enhancer
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Route exact path="/" component={App} />
        <Route exact path="/stories/:id" component={StoryDetail} />
        <Route exact path="/login" component={Login} />
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
