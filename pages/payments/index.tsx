import React from "react";
import Payments from "../../src/components/Tables/Paymets";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import WithAuth from "../../hoc/withAuth";
import {wrapper} from "../../store/store";
import {getPayments} from "../../store/actions/payments";


const BillsPage = () => {
    return <WithAuth><SliderContainer><Payments/></SliderContainer></WithAuth>
}

export const getServerSideProps = wrapper.getServerSideProps(store =>
    async ({req, res, query,  ...etc}) => {
        await store.dispatch(getPayments());
    }
);

export default BillsPage