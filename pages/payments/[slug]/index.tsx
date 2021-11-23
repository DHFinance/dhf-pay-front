import React, {useEffect} from "react";
import NoSidebarContainer from "../../../src/components/Layout/NoSidebarContainer";
import {wrapper} from "../../../store/store";
import {getPayment} from "../../../store/actions/payment";
import Payment from "../../../src/components/Forms/Payment";
import WithAuth from "../../../hoc/withAuth";
import SliderContainer from "../../../src/components/Layout/SliderContainer";


const PaymentPage = () => {

    return <WithAuth><SliderContainer><Payment/></SliderContainer></WithAuth>
}

export const getServerSideProps = wrapper.getServerSideProps(store =>
  async ({req, res, query,  ...etc}) => {
       await store.dispatch(getPayment(query?.slug)).catch(e => console.log(e));
    }
);

export default wrapper.withRedux(PaymentPage)