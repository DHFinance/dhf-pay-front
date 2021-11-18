import React from "react";
import Restore from "../../src/components/Forms/Restore";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import WithoutAuth from "../../hoc/withoutAuth";


const RestorePage = () => {
    return <WithoutAuth>
        <SliderContainer>
            <Restore/>
        </SliderContainer>
    </WithoutAuth>
}

export default RestorePage