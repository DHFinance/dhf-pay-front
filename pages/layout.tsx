import { Menu } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
HomeOutlined,
    UploadOutlined,
    SettingOutlined,
BookOutlined,
    LogoutOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import React, {useState} from "react";
import Logo from "../components/svg/Logo";
import CurrentUser from "../components/CurrentUser/CurrentUser";
import MainLayout from "../components/Layout/Layout";
import { Typography } from 'antd';
import ObjectsList from "../components/ObjectsList/ObjectsList";

const { Title } = Typography;

const Layout = ()=>{

    return <MainLayout>

        <Title>Объекты</Title>

        <ObjectsList />

    </MainLayout>
}

export default Layout