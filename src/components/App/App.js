import React, {Component} from "react";
import {Redirect, Route} from "react-router-dom";
import AdminLayout from "../../layouts/Admin";
import AuthLayout from "../../layouts/Auth";
import {withDataService} from "../hoc";
import {connect} from "react-redux";
import {setKinds} from "../../actions/kinds";

class App extends Component {
    componentDidMount() {
        const { getKinds, setKinds } = this.props;

        getKinds()
            .then( (data) => setKinds(data));
    }

    render() {
        return (
            <React.Fragment>
                <Route path="/admin" render={props => <AdminLayout {...props} />} />
                <Route path="/auth" render={props => <AuthLayout {...props} />} />
            </React.Fragment>
        );
    }
}

const mapMethodsToProps = ({getKinds}) => ({
    getKinds
});

export default connect(null, {setKinds})(withDataService(App, mapMethodsToProps));