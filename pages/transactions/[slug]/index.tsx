import { useRouter } from 'next/router';
import React from 'react';
import WithAuth from '../../../hoc/withAuth';
import Transaction from '../../../src/components/Info/Transaction';
import SliderContainer from '../../../src/components/Layout/SliderContainer';
import { wrapper } from '../../../src/store/store';

const TransactionPage = () => {
  const history = useRouter();
  const slug = history.query.slug;
  return (
    <WithAuth>
      <SliderContainer title={`Transactions ${slug}`}>
        <Transaction />
      </SliderContainer>
    </WithAuth>
  );
};

export default wrapper.withRedux(TransactionPage);
