//react
import React from 'react';
import ReactDOM from 'react-dom';
//css
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//js libs
import 'bootstrap/dist/js/bootstrap.bundle.min';
//components
import App from './App';
//stores
import MainStore from './stores/MainStore';
//worker
import * as serviceWorker from './serviceWorker';


var main_store = new MainStore();

ReactDOM.render(
  <React.StrictMode>
    <App MainStore={main_store}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
