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
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import AdminFooter from "../components/Footers/AdminFooter.js";
import Sidebar from "../components/Sidebar/Sidebar.js";

import routes from "../routes.js";
import {isLogin} from "../utils";
import {connect} from "react-redux";
import {getUser} from "../actions";
import {withErrorBoundary} from "../components/hoc";
import {Helmet} from "react-helmet";

class Admin extends React.Component {
    componentDidMount() {
        const { getUser } = this.props;
        if (isLogin()) {
            getUser()
        }
    }

    componentDidUpdate(e) {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }

    getRoutes = routes => {
        return routes.map((prop, key) => {
            if (prop.layout === "/admin") {
                return (
                    <Route
                        path={prop.layout + prop.path}
                        component={withErrorBoundary(prop.component, true)}
                        key={key}
                    />
                );
            } else {
                return null;
            }
        });
    };
    getBrandText = path => {
        for (let i = 0; i < routes.length; i++) {
            if (
                this.props.location.pathname.indexOf(
                    routes[i].layout + routes[i].path
                ) !== -1
            ) {
                return routes[i].name;
            }
        }
        return "Brand";
    };
    render() {
        if (!isLogin())
            return <Redirect to="/admin/auth/login"/>;
        return (
            <React.Fragment>
                <Helmet>
                    <title>?????????? ???????????? | Breeders Zone</title>
                </Helmet>
                <Sidebar
                    {...this.props}
                    logo={{
                        outterLink: process.env.REACT_APP_SITE_DOMAIN_URL,
                        text: 'Breeders Zone'
                    }}
                    routes={routes}
                />
                <div className="main-content" ref="mainContent">
                    <AdminNavbar
                        {...this.props}
                        brandText={this.getBrandText(this.props.location.pathname)}
                    />
                    <Switch>
                        {this.getRoutes(routes)}
                        <Redirect from="*" to="/admin/index" />
                    </Switch>
                    <Container fluid>
                        <AdminFooter />
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}


export default connect(null, {getUser})(Admin);
