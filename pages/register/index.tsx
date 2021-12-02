import React from "react";
import Register from "../../src/components/Forms/Register";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import WithoutAuth from "../../hoc/withoutAuth";
import {wrapper} from "../../store/store";


const RegisterPage = () => {
    return <WithoutAuth><SliderContainer>
        <Register/>
    </SliderContainer></WithoutAuth>
}

export default wrapper.withRedux(RegisterPage)