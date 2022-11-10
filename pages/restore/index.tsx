import React from 'react';
import WithoutAuth from '../../hoc/withoutAuth';
import Restore from '../../src/components/Forms/Restore';
import SliderContainer from '../../src/components/Layout/SliderContainer';
import { wrapper } from '../../src/store/store';

const RestorePage = () => {
  return (
    <WithoutAuth>
      <SliderContainer title={'Restore'}>
        <Restore />
      </SliderContainer>
    </WithoutAuth>
  );
};

export default wrapper.withRedux(RestorePage);
