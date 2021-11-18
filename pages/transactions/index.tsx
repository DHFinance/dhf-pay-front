import React from "react";
import Transactions from "../../src/components/Tables/Transactions";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import WithAuth from "../../hoc/withAuth";



const TransactionsPage = () => {
    return <WithAuth>
        <SliderContainer>
            <Transactions/>
        </SliderContainer>
    </WithAuth>

}

export default TransactionsPage