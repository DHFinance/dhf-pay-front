import React from 'react';
import WithAuth from '../../hoc/withAuth';
import SliderContainer from '../../src/components/Layout/SliderContainer';
import Transactions from '../../src/components/Tables/Transactions';
import { wrapper } from '../../src/store/store';

const TransactionsPage = () => {
  return (
    <WithAuth>
      <SliderContainer title={'Transactions'}>
        <Transactions />
      </SliderContainer>
    </WithAuth>
  );
};

export default wrapper.withRedux(TransactionsPage);
