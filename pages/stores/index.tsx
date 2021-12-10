import React from "react";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import {wrapper} from "../../store/store";
import WithAuth from "../../hoc/withAuth";
import Stores from "../../src/components/Tables/Stores";


const StoresPage = () => {
    return <WithAuth>
        <SliderContainer>
            <Stores/>
        </SliderContainer>
    </WithAuth>
}

export default wrapper.withRedux(StoresPage)