// @ts-nocheck
import "/styles/Home.module.css";
import React from "react";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import WithAuth from "../../hoc/withAuth";
import {wrapper} from "../../store/store";
import Buttons from "../../src/components/Forms/PaymentsButton";

const ButtonsBuilderPage = () => {
    return <WithAuth isBuilder>
        <SliderContainer title="Buttons Builder">
            <Buttons/>
        </SliderContainer>
    </WithAuth>
}

export default wrapper.withRedux(ButtonsBuilderPage)