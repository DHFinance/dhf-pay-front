// @ts-nocheck
import React, {useEffect} from "react";
import Bill from "../../../src/components/Forms/Bill";
import NoSidebarContainer from "../../../src/components/Layout/NoSidebarContainer";
import {wrapper} from "../../../store/store";
import {getPayments} from "../../../store/actions/payments";
import {getPayment} from "../../../store/actions/payment";
import Error from "next/error";
import {getTransactions} from "../../../store/actions/transacrions";

const BillPage = () => {
    return <NoSidebarContainer><Bill/></NoSidebarContainer>
}

export default wrapper.withRedux(BillPage)