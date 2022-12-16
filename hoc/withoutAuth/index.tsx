import { Spin } from 'antd';
import { useRouter } from 'next/router';
import React, { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 *
 * @param children {JSX}
 * @description hoc for authorization pages (login, restore, registration), where authorized users should not enter. If the user has a token in localstorage - redirects him to the start page
 */
const WithoutAuth: FC<Props> = ({ children }) => {
  const localToken = localStorage.getItem('token');
  const router = useRouter();

  if (!!localToken) {
    router.push('/');
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
  }

  return <>{children}</>;
};

export default WithoutAuth;
