import { useRouter } from 'next/router';
import React from 'react';
import WithAuth from '../../../hoc/withAuth';
import Payment from '../../../src/components/Info/Payment';
import SliderContainer from '../../../src/components/Layout/SliderContainer';
import { wrapper } from '../../../src/store/store';

const PaymentPage = () => {
  const history = useRouter();
  const slug = history.query.slug;
  return (
    <WithAuth>
      <SliderContainer title={`Button ${slug}`}>
        <Payment isButtons={true} />
      </SliderContainer>
    </WithAuth>
  );
};

export default wrapper.withRedux(PaymentPage);
