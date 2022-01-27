// @ts-nocheck
import React from "react";
import Transactions from "../../src/components/Tables/Transactions";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import WithAuth from "../../hoc/withAuth";
import {wrapper} from "../../store/store";



const TransactionsPage = () => {
    return <WithAuth>
        <SliderContainer title={`Transactions`}>
            <Transactions/>
        </SliderContainer>
    </WithAuth>
}

export default wrapper.withRedux(TransactionsPage)