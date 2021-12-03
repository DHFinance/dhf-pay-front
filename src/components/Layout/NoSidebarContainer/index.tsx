// @ts-nocheck
import { Layout, Menu, Breadcrumb } from 'antd';
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

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                    {props.children}
                </div>
            </Content>
        </Layout>
    );
}

export default NoSidebarContainer