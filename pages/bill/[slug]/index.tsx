import React, {useEffect} from "react";
import Bill from "../../../src/components/Forms/Bill";
import NoSidebarContainer from "../../../src/components/Layout/NoSidebarContainer";
import {wrapper} from "../../../store/store";
import {getPayments} from "../../../store/actions/payments";
import {getPayment} from "../../../store/actions/payment";

const BillPage = () => {

    return <NoSidebarContainer><Bill/></NoSidebarContainer>
}

export const getServerSideProps = wrapper.getServerSideProps(store =>
  async ({req, res, query,  ...etc}) => {
      await store.dispatch(getPayment(query?.slug)).catch(e => console.log(e));
    }
);

export default wrapper.withRedux(BillPage)