import React from "react";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import {wrapper} from "../../store/store";
import WithAuth from "../../hoc/withAuth";


const StoresPage = () => {
    return <WithAuth>
        <SliderContainer>
            Позже будут добавлена таблица с магазинами
        </SliderContainer>
    </WithAuth>
}

export default wrapper.withRedux(StoresPage)