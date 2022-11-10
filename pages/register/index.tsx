import React from 'react';
import WithoutAuth from '../../hoc/withoutAuth';
import Register from '../../src/components/Forms/Register';
import SliderContainer from '../../src/components/Layout/SliderContainer';
import { wrapper } from '../../src/store/store';

const RegisterPage = () => {
  return (
    <WithoutAuth>
      <SliderContainer title={'Register'}>
        <Register />
      </SliderContainer>
    </WithoutAuth>
  );
};

export default wrapper.withRedux(RegisterPage);
