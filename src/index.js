import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import ui from "./reducers/ui";
import { firebaseReducer } from "react-redux-firebase";
import firebase from "firebase";
import { reactReduxFirebase } from "react-redux-firebase";
import { Route } from "react-router";
import createHistory from "history/createBrowserHistory";
import {
	ConnectedRouter,
	routerReducer,
	routerMiddleware
} from "react-router-redux";
import Login from "./components/Login";

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
	apiKey: "AIzaSyA7VIpoNxE8qBbizEH17poykWmtC054bBs",
	authDomain: "test-project-1abfd.firebaseapp.com",
	databaseURL: "https://test-project-1abfd.firebaseio.com",
	projectId: "test-project-1abfd",
	storageBucket: "test-project-1abfd.appspot.com",
	messagingSenderId: "723013851452"
};

firebase.initializeApp(firebaseConfig);

// react-redux-firebase options
const config = {
	userProfile: "users", // firebase root where user profiles are stored
	enableLogging: false // enable/disable Firebase's database logging
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
				<Route exact path="/login" component={Login} />
			</div>
		</ConnectedRouter>
	</Provider>,
	document.getElementById("root")
);

registerServiceWorker();
