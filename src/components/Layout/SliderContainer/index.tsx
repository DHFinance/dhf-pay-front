// @ts-nocheck
import { Layout, Menu } from 'antd';
import Link from 'next/link'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined, AreaChartOutlined, ApiOutlined
} from '@ant-design/icons';
import "antd/dist/antd.css";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Title from "antd/lib/typography/Title";
import {postLogout} from "../../../../store/actions/auth";
import {useDispatch, useSelector} from "react-redux";
const { Header, Sider, Content } = Layout;

interface IContainerProps {
    children: JSX.Element | string
    title?: string | null
}

const SliderContainer = (props: IContainerProps) => {

    const user = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false)
    const history = useRouter()
    const titlePath = history.asPath.replace(/\//g, ' ').toUpperCase()


    const goLoginPage = () => {
        router.push('/login')
    }

    const onLogout = async () => {
      await dispatch(postLogout(goLoginPage))
    }

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" style={{
                    height: 32,
                    margin: 16,
                    background: 'rgba(255, 255, 255, 0.3)',
                }}/>
                <Menu theme="dark" mode="inline">

                    {user.data.token
                        ? (<>
                            {user.data.role === 'admin'
                                ?
                                <Menu.Item key="users" icon={<UserOutlined />}>
                                <Link href={'/users'}>
                                    Users
                                </Link>
                            </Menu.Item>
                                :
                                null
                            }
                        <Menu.Item key="stores" icon={<VideoCameraOutlined />}>
                            <Link href={'/stores'}>
                                Stores
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="transactions" icon={<VideoCameraOutlined />}>
                            <Link href={'/transactions'}>
                                Transactions
                            </Link>
                        </Menu.Item>
                            <Menu.Item key="invoices" icon={<AreaChartOutlined />}>
                                <Link href={'/invoices'}>
                                    Invoices
                                </Link>
                            </Menu.Item>
                            {user.data.role !== "admin"?
                                <Menu.Item key="invoicesBuilder" icon={<AreaChartOutlined />}>
                                    <Link href={'/invoicesBuilder'}>
                                        Invoices Builder
                                    </Link>
                                </Menu.Item> : null
                            }
                            <Menu.Item key="buttons" icon={<AreaChartOutlined />}>
                                <Link href={'/buttons'}>
                                    Buttons
                                </Link>
                            </Menu.Item>
                            {user.data.role !== "admin" ?
                            <Menu.Item key="buttonsBuilder" icon={<AreaChartOutlined />}>
                                <Link href={'/buttonsBuilder'}>
                                    Buttons Builder
                                </Link>
                            </Menu.Item>
                                : null}
                        <Menu.Item key="logout" onClick={onLogout} icon={<ApiOutlined />}>
                            Logout
                        </Menu.Item>
                    </>)
                        : <Menu.Item key="login" icon={<UserOutlined />}>
                            <Link href={'/login'}>
                                Login
                            </Link>
                        </Menu.Item>}

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
                    <Title style={{width: '100%', textAlign: 'center'}}>{props.title ?? titlePath}</Title>
                    {props.children}
                </Content>
            </Layout>
        </Layout>
    );
}

export default SliderContainer