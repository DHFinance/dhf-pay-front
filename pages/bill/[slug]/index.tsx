// @ts-nocheck
import React, {useEffect} from "react";
import Bill from "../../../src/components/Forms/Bill";
import NoSidebarContainer from "../../../src/components/Layout/NoSidebarContainer";
import {wrapper} from "../../../store/store";

const BillPage = () => {
    return <NoSidebarContainer><Bill/></NoSidebarContainer>
}

export default wrapper.withRedux(BillPage)