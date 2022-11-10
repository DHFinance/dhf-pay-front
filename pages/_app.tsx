import WithLoading from '../hoc/withLoading';
import { wrapper } from '../src/store/store';
import '../styles/globals.css';
import '../styles/Home.module.css';

function MyApp({ Component, pageProps }: any) {
  return (
    <WithLoading>
      <Component {...pageProps} />
    </WithLoading>
  );
}

export default wrapper.withRedux(MyApp);
