import React from "react";
import { DataServiceConsumer } from "../../context/DataServiceContext";

const withDataService = (Component, mapMethodsToProps) => (props) => (
    <DataServiceConsumer>
        {
            (dataService) => {

                const dataProps = mapMethodsToProps(dataService);

                return(
                    <Component {...props} {...dataProps}/>
                );
            }
        }
    </DataServiceConsumer>
);

export default withDataService;