import {NextPage} from "next";
import React from "react";
import Login from "../components/Login/Login";
import MainLayout from "../components/Layout/Layout";
import ObjectsList from "../components/ObjectsList/ObjectsList";
import {Typography} from "antd";
const { Title } = Typography;
import { Progress } from 'antd';

const DashboardPage = ()=>{
    return <MainLayout>

        <Title>Рабочий стол</Title>

        <div>
            <Progress percent={30} />
            <Progress percent={50} status="active" />
            <Progress percent={70} status="exception" />
            <Progress percent={100} />
            <Progress percent={50} showInfo={false} />
            <Progress type="circle" percent={75} />
            <Progress type="circle" percent={70} status="exception" />
            <Progress type="circle" percent={100} />

        </div>

    </MainLayout>
}


export default DashboardPage

