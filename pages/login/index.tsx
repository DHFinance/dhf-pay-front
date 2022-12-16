import React from 'react';
import WithoutAuth from '../../hoc/withoutAuth';
import Login from '../../src/components/Forms/Login';
import SliderContainer from '../../src/components/Layout/SliderContainer';
import { wrapper } from '../../src/store/store';

const AuthPage = () => {
  return (
    <WithoutAuth>
      <SliderContainer title={'Login'}>
        <Login />
      </SliderContainer>
    </WithoutAuth>
  );
};

export default wrapper.withRedux(AuthPage);
