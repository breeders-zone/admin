/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import {ConnectedRouter} from "connected-react-router";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import App from "./components/App";
import {DataServiceProvider} from "./context/DataServiceContext";
import {DataService} from "./services";
import {Provider} from "react-redux";
import configureStore, {history} from "./store";

const dataService = new DataService();
const store = configureStore();
window.qs = require('qs');

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <ConnectedRouter history={history}>
                <DataServiceProvider value={dataService}>
                    <Switch>
                        <App/>
                    </Switch>
                </DataServiceProvider>
            </ConnectedRouter>
        </BrowserRouter>,
    </Provider>,
  document.getElementById("root")
);
