// @ts-nocheck
import React from "react";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import WithAuth from "../../hoc/withAuth";
import {wrapper} from "../../store/store";
import PaymentsInvoices from "../../src/components/Tables/Paymets/invoices";


const InvoicesPage = () => {
    return <WithAuth><SliderContainer title={"Invoices"}><PaymentsInvoices/></SliderContainer></WithAuth>
}

export default wrapper.withRedux(InvoicesPage)