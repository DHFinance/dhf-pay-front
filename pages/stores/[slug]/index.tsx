import { useRouter } from 'next/router';
import React from 'react';
import WithAuth from '../../../hoc/withAuth';
import Store from '../../../src/components/Info/Store';
import SliderContainer from '../../../src/components/Layout/SliderContainer';
import { wrapper } from '../../../src/store/store';

const StorePage = () => {
  const history = useRouter();
  const slug = history.query.slug;
  return (
    <WithAuth>
      <SliderContainer title={`Store ${slug}`}>
        <Store />
      </SliderContainer>
    </WithAuth>
  );
};

export default wrapper.withRedux(StorePage);
