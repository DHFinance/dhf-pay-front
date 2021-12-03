// @ts-nocheck
import React from "react";
import Users from "../../src/components/Tables/Users";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import WithAuth from "../../hoc/withAuth";
import {wrapper} from "../../store/store";
import {getUsers} from "../../store/actions/users";


const UsersPage = () => {
    return <WithAuth><SliderContainer><Users/></SliderContainer></WithAuth>
}

export const getServerSideProps = wrapper.getServerSideProps(store =>
    async ({req, res, query,  ...etc}) => {
        await store.dispatch(getUsers()).catch(e => console.log(e));
    }
);

export default UsersPage