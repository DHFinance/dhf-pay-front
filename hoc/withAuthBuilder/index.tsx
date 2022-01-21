import React from 'react';
import WithAuth from "../withAuth";

const WithAuthBuilder = ({children, isAdmin, isBuilder}:any) => {
    return (
        <WithAuth isAdin={isAdmin} isBuilder={isBuilder}>{children}</WithAuth>
    );
};

export default WithAuthBuilder;
