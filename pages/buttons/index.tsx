// @ts-nocheck
import React from "react";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import WithAuth from "../../hoc/withAuth";
import {wrapper} from "../../store/store";
import PaymentsButton from "../../src/components/Tables/Paymets/buttons";


const InvoicesPage = () => {
    return <WithAuth><SliderContainer title={"Buttons"}><PaymentsButton/></SliderContainer></WithAuth>
}

export default wrapper.withRedux(InvoicesPage)