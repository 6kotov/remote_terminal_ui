import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "./components/redux/rootReducer";
import * as serviceWorker from "./serviceWorker";
import thunk from "redux-thunk";
import {save, load} from 'redux-localstorage-simple'
import { createStateSyncMiddleware, initStateWithPrevTab } from 'redux-state-sync';
import { SET_CLIENT_LIST, DELETE_CONNECTION_CLIENT, ADD_CLIENT_LIST, SET_SERVER_LIST } from "./components/redux/types";
 
const config = {
    whitelist: [DELETE_CONNECTION_CLIENT, SET_CLIENT_LIST, ADD_CLIENT_LIST, SET_SERVER_LIST ],
};
const tabSync = [createStateSyncMiddleware(config)];
const store = createStore(
    rootReducer,
    load({states:['connections_client.client_list']}),
    compose(
      applyMiddleware(thunk, save({states:['connections_client.client_list']}),...tabSync),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
initStateWithPrevTab(store);






ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
