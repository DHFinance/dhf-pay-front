// @ts-nocheck
import React, {useEffect} from "react";
import {wrapper} from "../../../store/store";
import WithAuth from "../../../hoc/withAuth";
import SliderContainer from "../../../src/components/Layout/SliderContainer";
import Store from "../../../src/components/Info/Store";

const StorePage = ({storeData}) => {

    return <WithAuth><SliderContainer><Store/></SliderContainer></WithAuth>
}

export default wrapper.withRedux(StorePage)