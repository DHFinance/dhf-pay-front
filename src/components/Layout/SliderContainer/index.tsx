import {
  ApiOutlined,
  AreaChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
import Title from 'antd/lib/typography/Title';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { UserRole } from '../../../modules/user/enums/userRole.enum';
import { postLogout } from '../../../store/slices/auth/asyncThunks/postLogout';

const { Header, Sider, Content } = Layout;

interface IContainerProps {
  children: JSX.Element | string;
  title?: string | null;
}

/**
 * @description Layout for the pages with a sidebar
 * @param props
 * @constructor
 */
const SliderContainer = (props: IContainerProps) => {
  const user = useTypedSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  
  const dispatch = useTypedDispatch();
  const history = useRouter();
  const titlePath = history.asPath.replace(/\//g, ' ').toUpperCase();

  /**
   * @description logout and go to login page
   */
  const onLogout = async () => {
    await dispatch(postLogout());
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          className="logo"
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.3)',
          }}
        />
        <Menu theme="dark" mode="inline">
          {user.data.token ? (
            <>
              {user.data.role === UserRole.Admin ? (
                <Menu.Item key="users" icon={<UserOutlined />}>
                  <Link href={'/users'}>Users</Link>
                </Menu.Item>
              ) : null}
              <Menu.Item key="stores" icon={<VideoCameraOutlined />}>
                <Link href={'/stores'}>Stores</Link>
              </Menu.Item>
              <Menu.Item key="transactions" icon={<VideoCameraOutlined />}>
                <Link href={'/transactions'}>Transactions</Link>
              </Menu.Item>
              <Menu.Item key="invoices" icon={<AreaChartOutlined />}>
                <Link href={'/invoices'}>Invoices</Link>
              </Menu.Item>
              {user.data.role !== UserRole.Admin ? (
                <Menu.Item key="invoicesBuilder" icon={<AreaChartOutlined />}>
                  <Link href={'/invoicesBuilder'}>Invoices Builder</Link>
                </Menu.Item>
              ) : null}
              <Menu.Item key="buttons" icon={<AreaChartOutlined />}>
                <Link href={'/buttons'}>Buttons</Link>
              </Menu.Item>
              {user.data.role !== UserRole.Admin ? (
                <Menu.Item key="buttonsBuilder" icon={<AreaChartOutlined />}>
                  <Link href={'/buttonsBuilder'}>Buttons Builder</Link>
                </Menu.Item>
              ) : null}
              <Menu.Item key="logout" onClick={onLogout} icon={<ApiOutlined />}>
                Logout
              </Menu.Item>
            </>
          ) : (
            <Menu.Item key="login" icon={<UserOutlined />}>
              <Link href={'/login'}>Login</Link>
            </Menu.Item>
          )}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ background: 'white' }}
        >
          {collapsed ? (
            <MenuUnfoldOutlined
              className={'trigger'}
              onClick={() => setCollapsed((prevState) => !prevState)}
            />
          ) : (
            <MenuFoldOutlined
              className={'trigger'}
              onClick={() => setCollapsed((prevState) => !prevState)}
            />
          )}
        </Header>

        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          <Title style={{ textAlign: 'center', width: '100%' }}>
            {(
              <p
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {props.title}
              </p>
            ) ?? titlePath}
          </Title>
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SliderContainer;
