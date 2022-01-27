// @ts-nocheck
import React, {useEffect} from "react";
import {wrapper} from "../../store/store";
// @ts-ignore
import WithAuth from "../../hoc/withAuth";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import InvoicesBuilder from "../../src/components/Forms/InvoicesBuilder";


const InvoicesBuilderPage = () => {
    return <WithAuth isBuilder><SliderContainer title="Invoices Builder"><InvoicesBuilder/></SliderContainer></WithAuth>
}

export default wrapper.withRedux(InvoicesBuilderPage)