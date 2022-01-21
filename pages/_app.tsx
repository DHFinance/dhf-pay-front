import '../styles/globals.css'
import "../styles/Home.module.css";
import type { AppProps } from 'next/app'
import { wrapper } from '../store/store';
import WithLoading from "../hoc/withLoading";
import {getPayments} from "../store/actions/payments";

function MyApp({ Component, pageProps }: AppProps) {

  return <WithLoading><Component {...pageProps} /></WithLoading>
}



export default wrapper.withRedux(MyApp);
