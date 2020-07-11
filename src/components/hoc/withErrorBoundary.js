import React from "react";
import ErrorBoundary from "../ErrorBoundary";

const withErrorBoundary = (Wrapped, header = false) => {
    return ( props ) => (
        <ErrorBoundary header={header}>
            <Wrapped {...props}/>
        </ErrorBoundary>
    );
};

export default withErrorBoundary;