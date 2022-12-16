import { Spin } from 'antd';
import React from 'react';

const Loader = () => (
  <Spin
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100vh',
    }}
  />
);

export { Loader };
