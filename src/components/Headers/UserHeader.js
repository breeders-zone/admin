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

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";
import {connect} from "react-redux";

class UserHeader extends React.Component {
  render() {
      const { profile } = this.props;
    return (
        <div
            className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
            style={{
                minHeight: "600px",
                backgroundSize: "cover",
                backgroundPosition: "center top"
            }}
        >
            {/* Mask */}
            <span className="mask bg-gradient-default opacity-8" />
            {/* Header container */}
            <Container className="d-flex align-items-center" fluid>
                <Row>
                    <Col lg="7" md="10">
                        <h1 className="display-2 text-white text-nowrap">Привет {profile.name}</h1>
                        <p className="text-white mt-0 mb-5">
                            Это твой профиль админа, здесь ты можешь изменить свою почту
                            или пароль
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
  }
}

const mapStateToProps = ({profile}) => ({
    profile
});

export default connect(mapStateToProps)(UserHeader);
