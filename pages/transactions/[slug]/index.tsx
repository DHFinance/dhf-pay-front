import React, {useEffect} from "react";
import Bill from "../../../src/components/Forms/Bill";
import NoSidebarContainer from "../../../src/components/Layout/NoSidebarContainer";
import {wrapper} from "../../../store/store";
import {getPayments} from "../../../store/actions/payments";
import Transaction from "../../../src/components/Forms/Transaction";
import WithAuth from "../../../hoc/withAuth";
import SliderContainer from "../../../src/components/Layout/SliderContainer";

const TransactionPage = () => {

    return <WithAuth><SliderContainer><Transaction/></SliderContainer></WithAuth>
}

export const getServerSideProps = wrapper.getServerSideProps(store =>
  async ({req, res, query,  ...etc}) => {
       await store.dispatch(getPayments());
    }
);

export default wrapper.withRedux(TransactionPage)