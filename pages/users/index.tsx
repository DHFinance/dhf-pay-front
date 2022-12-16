import React from 'react';
import WithAuth from '../../hoc/withAuth';
import SliderContainer from '../../src/components/Layout/SliderContainer';
import Users from '../../src/components/Tables/Users';

const UsersPage = () => {
  return (
    <WithAuth>
      <SliderContainer title={'Users'}>
        <Users />
      </SliderContainer>
    </WithAuth>
  );
};

export default UsersPage;
