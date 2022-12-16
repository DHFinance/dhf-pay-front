import React from 'react';
import WithAuth from '../../hoc/withAuth';
import SliderContainer from '../../src/components/Layout/SliderContainer';
import Payments from '../../src/components/Tables/Paymets';
import { wrapper } from '../../src/store/store';

const InvoicesPage = () => {
  return (
    <WithAuth>
      <SliderContainer title={'Buttons'}>
        <Payments isButtons entity={'buttons'} />
      </SliderContainer>
    </WithAuth>
  );
};

export default wrapper.withRedux(InvoicesPage);
