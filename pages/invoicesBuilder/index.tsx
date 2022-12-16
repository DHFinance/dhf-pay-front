import React from 'react';
import WithAuth from '../../hoc/withAuth';
import InvoicesBuilder from '../../src/components/Forms/InvoicesBuilder';
import SliderContainer from '../../src/components/Layout/SliderContainer';
import { wrapper } from '../../src/store/store';

const InvoicesBuilderPage = () => {
  return (
    <WithAuth isBuilder>
      <SliderContainer title="Invoices Builder">
        <InvoicesBuilder />
      </SliderContainer>
    </WithAuth>
  );
};

export default wrapper.withRedux(InvoicesBuilderPage);
