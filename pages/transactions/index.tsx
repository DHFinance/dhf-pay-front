// @ts-nocheck
import React from "react";
import Transactions from "../../src/components/Tables/Transactions";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import WithAuth from "../../hoc/withAuth";
import {wrapper} from "../../store/store";
import {getTransactions} from "../../store/actions/transacrions";



const TransactionsPage = () => {
    return <WithAuth>
        <SliderContainer>
            <Transactions/>
        </SliderContainer>
    </WithAuth>
}

export const getServerSideProps = wrapper.getServerSideProps(store =>
    async ({req, res, query,  ...etc}) => {
        await store.dispatch(getTransactions()).catch(e => console.log(e));
    }
);

export default wrapper.withRedux(TransactionsPage)