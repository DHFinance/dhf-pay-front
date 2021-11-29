import React, {useEffect} from "react";
import Bill from "../../../src/components/Forms/Bill";
import NoSidebarContainer from "../../../src/components/Layout/NoSidebarContainer";
import {wrapper} from "../../../store/store";
import {getPayments} from "../../../store/actions/payments";
import {getPayment} from "../../../store/actions/payment";
import Error from "next/error";

const BillPage = ({bill}) => {
    return bill ? <NoSidebarContainer><Bill/></NoSidebarContainer> : <Error title={'Bill does not exist'} statusCode={500}/>
}

export const getServerSideProps = wrapper.getServerSideProps(store =>
  async ({req, res, query,  ...etc}) => {
      const bill = await store.dispatch(getPayment(query?.slug)).catch(e => console.log(e.response.data));

      return {
          props: {
              bill: !!bill
          }
      }
    }
);

export default wrapper.withRedux(BillPage)