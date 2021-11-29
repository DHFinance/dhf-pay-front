import React, { useState } from 'react';
import { Avatar, Button } from 'antd';

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const GapList = [4, 3, 2, 1];
import { Drawer } from 'antd';
const CurrentUser: React.FC = () => {
    const [user, setUser] = useState(UserList[0]);
    const [color, setColor] = useState(ColorList[0]);
    const [gap, setGap] = useState(GapList[0]);
    const changeUser = () => {
        const index = UserList.indexOf(user);
        setUser(index < UserList.length - 1 ? UserList[index + 1] : UserList[0]);
        setColor(index < ColorList.length - 1 ? ColorList[index + 1] : ColorList[0]);
    };
    const changeGap = () => {
        const index = GapList.indexOf(gap);
        setGap(index < GapList.length - 1 ? GapList[index + 1] : GapList[0]);
    };

    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    return (
        <div>
            <Avatar style={{ backgroundColor: color, verticalAlign: 'middle' }} size="large" gap={gap}>
                {user}
            </Avatar>
            <Button
                size="small"
                style={{ margin: '0 16px', verticalAlign: 'middle' }}
                onClick={showDrawer}
            >
                test@test.com
            </Button>

            <Drawer title="Доп. меню" placement="right" onClose={onClose} visible={visible}>
                <p>Здесь будет поиск</p>
                <p>А также другие вспомогательные элементы</p>
            </Drawer>

        </div>
    );
};


export default CurrentUser