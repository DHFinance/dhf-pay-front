import React, {useState} from "react";
import MainLayout from "../components/Layout/Layout";
import { Typography } from 'antd';
import ObjectsList from "../components/ObjectsList/ObjectsList";

const { Title } = Typography;

const ObjectPage = ()=>{

    return <MainLayout>

        <Title>Объекты</Title>

        <ObjectsList />

    </MainLayout>
}

export default ObjectPage