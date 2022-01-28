import React from 'react';
import WithAuth from "../withAuth";

/**
 * @description обертка для страниц buttons/invoices builder, недоступных админу
 */
const WithAuthBuilder = ({children, isAdmin, isBuilder}:any) => {
    return (
        <WithAuth isAdin={isAdmin} isBuilder={isBuilder}>{children}</WithAuth>
    );
};

export default WithAuthBuilder;
