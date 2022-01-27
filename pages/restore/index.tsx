import React from "react";
import Restore from "../../src/components/Forms/Restore";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import WithoutAuth from "../../hoc/withoutAuth";
import {wrapper} from "../../store/store";


const RestorePage = () => {
    return <WithoutAuth>
        <SliderContainer title={"Restore"}>
            <Restore/>
        </SliderContainer>
    </WithoutAuth>
}

export default wrapper.withRedux(RestorePage)