import React from "react";
import Header from "../components/Headers/Header";
import {Container} from "reactstrap";
import DivorceForm from "../components/DivorceForm";

const Divorce = (props) => {
    return (
        <React.Fragment>
            <Header/>
            <Container className="mt--7" fluid>
                <DivorceForm id={props.match.params.id}/>
            </Container>
        </React.Fragment>
    )
};

export default Divorce;