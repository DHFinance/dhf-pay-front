import React from "react";
import Payments from "../../src/components/Tables/Bills";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import WithAuth from "../../hoc/withAuth";


const BillsPage = () => {
    return <WithAuth><SliderContainer><Payments/></SliderContainer></WithAuth>
}

export default BillsPage