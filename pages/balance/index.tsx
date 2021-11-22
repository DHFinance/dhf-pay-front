import React from "react";
import Payments from "../../src/components/Tables/Bills";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import WithAuth from "../../hoc/withAuth";
import Balance from "../../src/components/Forms/Balance";


const BillsPage = () => {
    return <WithAuth><SliderContainer><Balance/></SliderContainer></WithAuth>
}

export default BillsPage