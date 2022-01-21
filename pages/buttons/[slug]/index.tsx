// @ts-nocheck
import React from "react";
import {wrapper} from "../../../store/store";
// @ts-ignore
import WithAuth from "../../../hoc/withAuth";
import SliderContainer from "../../../src/components/Layout/SliderContainer";
import InfoButton from "../../../src/components/Info/Payment/button";


const PaymentPage = () => {

    return <WithAuth><SliderContainer><InfoButton/></SliderContainer></WithAuth>
}

export default wrapper.withRedux(PaymentPage)