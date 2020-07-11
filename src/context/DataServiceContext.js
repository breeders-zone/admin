import React from 'react';
import {DataService} from "../services";

const DataServiceContext = React.createContext(new DataService());
const DataServiceProvider = DataServiceContext.Provider;
const DataServiceConsumer = DataServiceContext.Consumer;

export default DataServiceContext;

export {
    DataServiceProvider,
    DataServiceConsumer
}