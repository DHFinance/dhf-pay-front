// @ts-nocheck
import React from "react";
import SliderContainer from "../../../src/components/Layout/SliderContainer";
import WithAuth from "../../../hoc/withAuth";
import {wrapper} from "../../../store/store";
import ButtonsForm from "../../../src/components/Forms/PaymentsButton";

const PaymentsButtonsPage = () => {
    return <WithAuth>
        <SliderContainer>
            <ButtonsForm/>
        </SliderContainer>
    </WithAuth>
}

export default wrapper.withRedux(PaymentsButtonsPage)