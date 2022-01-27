// @ts-nocheck
import React from "react";
import {wrapper} from "../../../store/store";
// @ts-ignore
import WithAuth from "../../../hoc/withAuth";
import SliderContainer from "../../../src/components/Layout/SliderContainer";
import Payment from "../../../src/components/Info/Payment";
import {useRouter} from "next/router";


const PaymentPage = () => {
    const history = useRouter();
    const slug = history.query.slug;
    return <WithAuth><SliderContainer title={`Button ${slug}`}><Payment isButtons={true}/></SliderContainer></WithAuth>
}

export default wrapper.withRedux(PaymentPage)