// @ts-nocheck
import React, {useEffect} from "react";
import {wrapper} from "../../../store/store";
import WithAuth from "../../../hoc/withAuth";
import SliderContainer from "../../../src/components/Layout/SliderContainer";
import Store from "../../../src/components/Info/Store";
import User from "../../../src/components/Info/User";
import {useRouter} from "next/router";

const StorePage = ({storeData}) => {
    const history = useRouter();
    const slug = history.query.slug;
    return <WithAuth><SliderContainer title={`User ${slug}`}><User/></SliderContainer></WithAuth>
}

export default wrapper.withRedux(StorePage)