// @ts-nocheck
import React, {useEffect} from "react";
import NoSidebarContainer from "../../../src/components/Layout/NoSidebarContainer";
import {wrapper} from "../../../store/store";
// @ts-ignore
import {getPayment} from "../../../store/actions/payment";
import Payment from "../../../src/components/Info/Payment";
import WithAuth from "../../../hoc/withAuth";
import SliderContainer from "../../../src/components/Layout/SliderContainer";
import Error from "next/error";


const PaymentPage = () => {

    return <WithAuth><SliderContainer><Payment/></SliderContainer></WithAuth>
}

export default wrapper.withRedux(PaymentPage)