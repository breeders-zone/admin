import React from "react";
import Header from "../components/Headers/Header";
import {Container} from "reactstrap";
import ProductForm from "../components/ProductForm";

const Product = (props) => {
    return (
        <React.Fragment>
            <Header/>
            <Container className="mt--7" fluid>
                <ProductForm id={props.match.params.id}/>
            </Container>
        </React.Fragment>
    )
};

export default Product;