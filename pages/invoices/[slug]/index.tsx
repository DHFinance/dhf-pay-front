// @ts-nocheck
import React from "react";
import {wrapper} from "../../../store/store";
// @ts-ignore
import Payment from "../../../src/components/Info/Payment";
import WithAuth from "../../../hoc/withAuth";
import SliderContainer from "../../../src/components/Layout/SliderContainer";


const PaymentPage = () => {

    return <WithAuth><SliderContainer><Payment/></SliderContainer></WithAuth>
}

export default wrapper.withRedux(PaymentPage)