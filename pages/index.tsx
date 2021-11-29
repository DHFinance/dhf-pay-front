import {NextPage} from "next";
import React from "react";
import Login from "../components/Login/Login";
import MainLayout from "../components/Layout/Layout";
import ObjectsList from "../components/ObjectsList/ObjectsList";
import {Card, Typography} from "antd";
const { Title } = Typography;
import { Progress } from 'antd';
import { Carousel } from 'antd';

const contentStyle = {
    height: '160px',
    color: 'black',
    lineHeight: '160px',
    textAlign: 'center',
    background: 'white',
};

const DashboardPage = ()=>{
  return <MainLayout>

    <Title>Рабочий стол</Title>

    <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start"

    }}>
      <Card title="Актуализация" bordered={true} style={{ width: '180px', marginRight: '2em' }}>
        <Progress type="circle" percent={70} status="success" />

      </Card>

     <Card title="Ошибки при выгрузке на циан" bordered={true} style={{ width: '300px', marginRight: '2em' }}>
         2 из 1000 объектов
       <Progress percent={5} status="exception" />
     </Card>


     <Card title="Обновлено за сегодня" bordered={true} style={{ width: '250px', marginRight: '2em' }}>
         <span style={{fontSize: 50}}>10</span> объектов
     </Card>


     <Card title="Актуальные задачи" bordered={true} style={{ width: '400px', marginRight: '2em' }}>
         <Carousel autoplay>
             <div>
                 <p style={contentStyle}>Перезвонить клиенту &quot;RNB Consulting&quot; в 15:00</p>
             </div>
             <div>
                 <p style={contentStyle}>Внести актуальные документы по договору</p>
             </div>
             <div>
                 <p style={contentStyle}>Онлайн встреча с разработчиками в 18:00</p>
             </div>
         </Carousel>
     </Card>



    </div>

  </MainLayout>
}


export default DashboardPage

