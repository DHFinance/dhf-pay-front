import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Layout, Popover } from 'antd';
import 'antd/dist/antd.css';
import { useState } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';

const { Content } = Layout;

interface IContainerProps {
  children: JSX.Element | string;
}

/**
 * @description Layout for the pages without a sidebar
 * @param props
 * @constructor
 */
const NoSidebarContainer = (props: IContainerProps) => {
  const casperUser = useTypedSelector((state) => state.pay.data);
  
  const [isPopoverHide, setPopoverHide] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        className="site-layout"
        style={{
          padding: '0 50px',
          marginTop: 64,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ alignSelf: 'end', paddingRight: '24px' }}>
          <Popover
            placement="bottom"
            content={
              <div>
                <p>
                  Balance: {casperUser.cspr} CSPR (${casperUser.usd})
                </p>
                <p>Hash: {casperUser.hash}</p>
                <p>Public key: {casperUser.public}</p>
              </div>
            }
            title={casperUser.public}
            trigger="click"
            visible={isPopoverHide}
            onVisibleChange={() => setPopoverHide(!isPopoverHide)}
          >
            {casperUser.public ? (
              <Button type="primary">
                {casperUser.public}
                {!isPopoverHide ? <DownOutlined /> : <UpOutlined />}
              </Button>
            ) : null}
          </Popover>
        </div>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 380 }}
        >
          {props.children}
        </div>
      </Content>
    </Layout>
  );
};

export default NoSidebarContainer;
