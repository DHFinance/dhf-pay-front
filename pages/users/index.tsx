// @ts-nocheck
import React from "react";
import Users from "../../src/components/Tables/Users";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import WithAuth from "../../hoc/withAuth";


const UsersPage = () => {
    return <WithAuth><SliderContainer title={`Users`}><Users/></SliderContainer></WithAuth>
}

export default UsersPage