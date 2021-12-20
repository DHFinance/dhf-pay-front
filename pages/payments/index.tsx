// @ts-nocheck
import React from "react";
import Payments from "../../src/components/Tables/Paymets";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import WithAuth from "../../hoc/withAuth";
import {wrapper} from "../../store/store";


const PaymentsPage = () => {
    return <WithAuth><SliderContainer><Payments/></SliderContainer></WithAuth>
}

export default wrapper.withRedux(PaymentsPage)