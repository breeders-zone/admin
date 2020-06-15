import React from "react";
import Header from "../components/Headers/Header";
import {Container} from "reactstrap";
import ProductForm from "../components/ProductForm";
import LevelForm from "../components/LevelForm/LevelForm";

const Level = (props) => {
    return (
        <React.Fragment>
            <Header/>
            <Container className="mt--7" fluid>
                <LevelForm id={props.match.params.id}/>
            </Container>
        </React.Fragment>
    )
};

export default Level;