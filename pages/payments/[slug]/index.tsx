import React, {useEffect} from "react";
import NoSidebarContainer from "../../../src/components/Layout/NoSidebarContainer";
import {wrapper} from "../../../store/store";
import {getPayment} from "../../../store/actions/payment";
import Payment from "../../../src/components/Info/Payment";
import WithAuth from "../../../hoc/withAuth";
import SliderContainer from "../../../src/components/Layout/SliderContainer";
import Error from "next/error";


const PaymentPage = ({payment}) => {

    return payment ? <WithAuth><SliderContainer><Payment/></SliderContainer></WithAuth> : <Error title={'Payment does not exist'} statusCode={500}/>
}

export const getServerSideProps = wrapper.getServerSideProps(store =>
  async ({req, res, query,  ...etc}) => {
       const payment = await store.dispatch(getPayment(query?.slug)).catch(e => console.log(e));

      return {
          props: {
              payment: !!payment
          }
      }
    }
);

export default wrapper.withRedux(PaymentPage)