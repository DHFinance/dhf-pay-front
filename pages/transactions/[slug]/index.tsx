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

const TransactionPage = ({transaction}) => {

    return transaction ? <WithAuth><SliderContainer><Transaction/></SliderContainer></WithAuth> : <Error title={'Transaction does not exist'} statusCode={500}/>
}

export const getServerSideProps = wrapper.getServerSideProps(store =>
  async ({req, res, query,  ...etc}) => {
       const transaction = await store.dispatch(getTransaction(query?.slug)).catch(e => console.log(e));
      return {
          props: {
              transaction: !!transaction
          }
      }
    }
);

export default wrapper.withRedux(TransactionPage)