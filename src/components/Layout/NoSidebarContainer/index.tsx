// @ts-nocheck
import {Layout, Menu, Breadcrumb, Button, Popover} from 'antd';
import {DownOutlined, UpOutlined} from "@ant-design/icons";
import "antd/dist/antd.css";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {postLogout} from "../../../../store/actions/auth";
import {useDispatch, useSelector} from "react-redux";

const { Header, Content, Footer } = Layout;

interface IContainerProps {
    children: JSX.Element | string
}

const NoSidebarContainer = (props: IContainerProps) => {
    const [isPopoverHide, setPopoverHide] = useState(false);
    const casperUser = useSelector((state) => state.pay.data);
    console.log(casperUser)
    return (
        <Layout style={{minHeight: '100vh'}}>
            <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64, display:"flex", flexDirection:"column" }}>
                <div style={{alignSelf:"end", paddingRight:"24px"}}>
                    <Popover
                        placement="bottom"
                        content={
                            <div>
                                <p>Balance: {casperUser.cspr} CSPR (${casperUser.usd})</p>
                                <p>Hash: {casperUser.hash}</p>
                                <p>Public key: {casperUser.public}</p>
                            </div>
                        }
                        title={casperUser.public}
                        trigger="click"
                        visible={isPopoverHide}
                        onVisibleChange={()=>setPopoverHide(!isPopoverHide)}
                    >
                        {casperUser.public ?
                            <Button type="primary">
                                {casperUser.public}
                                {
                                    !isPopoverHide ? <DownOutlined /> : <UpOutlined />
                                }
                            </Button>
                            : null
                        }
                    </Popover>
                </div>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                    {props.children}
                </div>
            </Content>
        </Layout>
    );
}

export default NoSidebarContainer