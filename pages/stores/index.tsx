import React from 'react';
import WithAuth from '../../hoc/withAuth';
import SliderContainer from '../../src/components/Layout/SliderContainer';
import Stores from '../../src/components/Tables/Stores';
import { wrapper } from '../../src/store/store';

const StoresPage = () => {
  return (
    <WithAuth>
      <SliderContainer title={'Stores'}>
        <Stores />
      </SliderContainer>
    </WithAuth>
  );
};

export default wrapper.withRedux(StoresPage);
