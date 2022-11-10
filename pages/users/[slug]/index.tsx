import { useRouter } from 'next/router';
import React from 'react';
import WithAuth from '../../../hoc/withAuth';
import User from '../../../src/components/Info/User';
import SliderContainer from '../../../src/components/Layout/SliderContainer';
import { wrapper } from '../../../src/store/store';

const StorePage = () => {
  const history = useRouter();
  const slug = history.query.slug;
  return (
    <WithAuth>
      <SliderContainer title={`User ${slug}`}>
        <User />
      </SliderContainer>
    </WithAuth>
  );
};

export default wrapper.withRedux(StorePage);
