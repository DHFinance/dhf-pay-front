import { Layout, Menu } from 'antd';
import Link from 'next/link'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined, AreaChartOutlined,
} from '@ant-design/icons';
import "antd/dist/antd.css";
import {useState} from "react";
import {useRouter} from "next/router";
import Title from "antd/lib/typography/Title";

const { Header, Sider, Content } = Layout;

interface IContainerProps {
    children: JSX.Element
}

const SliderContainer = (props: IContainerProps) => {

    const [collapsed, setCollapsed] = useState(false)
    const history = useRouter()
    const title = history.route.replace('/', '').toUpperCase()

    return (
        <Layout style={{height: '100vh'}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" style={{
                    height: 32,
                    margin: 16,
                    background: 'rgba(255, 255, 255, 0.3)',
                }}/>
                <Menu theme="dark" mode="inline">
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        <Link href={'/bills'}>
                            Users
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}>
                        <Link href={'/register'}>
                            Register
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UserOutlined />}>
                        <Link href={'/restore'}>
                            Restore
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<VideoCameraOutlined />}>
                        <Link href={'/transactions'}>
                            Transactions
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<AreaChartOutlined />}>
                        <Link href={'/bills'}>
                            Bills
                        </Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{background: "white"}}>
                    {
                        collapsed ?
                            <MenuUnfoldOutlined className={'trigger'} onClick={() => setCollapsed((prevState => !prevState))}/>
                            : <MenuFoldOutlined className={'trigger'} onClick={() => setCollapsed((prevState => !prevState))}/>
                    }
                </Header>

                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    <Title style={{width: '100%', textAlign: 'center'}}>{title}</Title>
                    {props.children}
                </Content>
            </Layout>
        </Layout>
    );
}

export default SliderContainer