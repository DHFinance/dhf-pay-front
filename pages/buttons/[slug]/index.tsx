// @ts-nocheck
import React from "react";
import {wrapper} from "../../../store/store";
// @ts-ignore
import WithAuth from "../../../hoc/withAuth";
import SliderContainer from "../../../src/components/Layout/SliderContainer";
import Payment from "../../../src/components/Info/Payment";


const PaymentPage = () => {

    return <WithAuth><SliderContainer><Payment isButtons={true}/></SliderContainer></WithAuth>
}

export default wrapper.withRedux(PaymentPage)