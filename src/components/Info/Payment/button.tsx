import React from 'react';
import Payment from "./index";
import {useSelector} from "react-redux";
import {buttons} from "../../../data/buttonsBuilder";

const InfoButton = () => {
    return (
        <Payment isButtons/>
    );
};

export default InfoButton;
