import React from 'react';
import WithAuth from "../withAuth";

/**
 * @description wrapper for buttons/invoices builder pages inaccessible to admin
 */
const WithAuthBuilder = ({children, isAdmin, isBuilder}:any) => {
    return (
        <WithAuth isAdin={isAdmin} isBuilder={isBuilder}>{children}</WithAuth>
    );
};

export default WithAuthBuilder;
