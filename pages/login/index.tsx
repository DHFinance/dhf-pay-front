import React from "react";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import Login from "../../src/components/Forms/Login";
import WithoutAuth from "../../hoc/withoutAuth";


const AuthPage = () => {
    return <WithoutAuth>
        <SliderContainer>
            <Login/>
        </SliderContainer>
    </WithoutAuth>

}

export default AuthPage