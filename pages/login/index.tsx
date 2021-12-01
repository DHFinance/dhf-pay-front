import React from "react";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import Login from "../../src/components/Forms/Login";
import WithoutAuth from "../../hoc/withoutAuth";
import {wrapper} from "../../store/store";


const AuthPage = () => {
    return <WithoutAuth>
        <SliderContainer>
            <Login/>
        </SliderContainer>
    </WithoutAuth>

}

export default wrapper.withRedux(AuthPage)