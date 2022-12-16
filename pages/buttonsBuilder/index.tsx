import '/styles/Home.module.css';
import React from 'react';
import WithAuth from '../../hoc/withAuth';
import Buttons from '../../src/components/Forms/PaymentsButton';
import SliderContainer from '../../src/components/Layout/SliderContainer';
import { wrapper } from '../../src/store/store';

const ButtonsBuilderPage = () => {
  return (
    <WithAuth isBuilder>
      <SliderContainer title="Buttons Builder">
        <Buttons />
      </SliderContainer>
    </WithAuth>
  );
};

export default wrapper.withRedux(ButtonsBuilderPage);
