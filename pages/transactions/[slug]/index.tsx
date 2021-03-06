// @ts-nocheck
import React, {useEffect} from "react";
import Bill from "../../../src/components/Forms/Bill";
import NoSidebarContainer from "../../../src/components/Layout/NoSidebarContainer";
import {wrapper} from "../../../store/store";
import {getPayments} from "../../../store/actions/payments";
import Transaction from "../../../src/components/Info/Transaction";
import WithAuth from "../../../hoc/withAuth";
import SliderContainer from "../../../src/components/Layout/SliderContainer";
import Error from "next/error";
import {getTransaction} from "../../../store/actions/transaction";
import {useRouter} from "next/router";

const TransactionPage = () => {
    const history = useRouter();
    const slug = history.query.slug;
    return <WithAuth><SliderContainer title={`Transactions ${slug}`}><Transaction/></SliderContainer></WithAuth>
}

export default wrapper.withRedux(TransactionPage)