import { Spin } from 'antd';
import Router from 'next/router';
import React, { FC, ReactNode, useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
}

/**
 *
 * @param children {JSX}
 * @description Nextjs creates pages before getting localstorage. This hoc prevents components from rendering until localstorage is received.
 */
const WithLoading: FC<Props> = ({ children }) => {
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    if (localStorage) {
      setStorageLoaded(true);
    }
  }, []);

  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  if ((typeof window === 'undefined' && !storageLoaded) || loading)
    return (
      <Spin
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh',
        }}
      />
    );

  return <>{children}</>;
};

export default WithLoading;
