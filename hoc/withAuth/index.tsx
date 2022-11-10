import { Spin } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useTypedDispatch } from '../../src/hooks/useTypedDispatch';
import { useTypedSelector } from '../../src/hooks/useTypedSelector';
import { UserRole } from '../../src/modules/user/enums/userRole.enum';
import { reAuth } from '../../src/store/slices/auth/asyncThunks/reAuth';
import { wrapper } from '../../src/store/store';

/**
 *
 * @param children {JSX} - the component that will be rendered after the calculations
 * @param isAdmin {boolean} - whether the page is admin only
 * @param isBuilder {boolean} - if the page is an invoices/button builder - prevents the admin from accessing it
 * @description wrapper responsible for authorization. Sends the user to the login page if they accessed the page wrapped in this hoc without being logged in.
 */
const WithAuth = ({ children, isAdmin, isBuilder }: any) => {
  const auth = useTypedSelector((state) => state.auth);

  const localToken = localStorage.getItem('token');
  
  const router = useRouter();
  const dispatch = useTypedDispatch();

  /**
   * @description wrapper, makes a request to the database, checking the existence of such a user by token in localstorage
   */
  useEffect(() => {
    if (localToken === null) {
      return;
    }
    dispatch(reAuth(localToken));
  }, []);

  /**
   * @description if the user does not have a token in localstorage - throws it to the authorization page
   */
  if (!localToken) {
    router.push('/login');
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
  /**
   * @description while waiting for a response from the server, a spinner is displayed
   */
  if (!(auth.status.error || auth.data.token)) {
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
  /**
   * @description if the role of an authorized user has changed to customer, and he must be an administrator, access is denied
   */
  if (isAdmin && auth.data.role === UserRole.Customer) {
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
  if (isBuilder) {
    if (auth.data.role === UserRole.Admin) {
      router.push('/');
    }
  }

  return children;
};

export default wrapper.withRedux(WithAuth);
