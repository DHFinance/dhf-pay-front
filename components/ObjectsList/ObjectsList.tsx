import { Table, Button } from 'antd';
import React from "react";

const columns = [
    {
        title: 'Название',
        dataIndex: 'name',
    },
    {
        title: 'ID',
        dataIndex: 'age',
    },
    {
        title: 'Адрес',
        dataIndex: 'address',
    },
];

const data: any = [];
for (let i = 0; i < 46; i++) {
    data.push({
        key: i,
        name: `Бизнес-центр "Neva Towers"${i}`,
        age: i+1,
        address: `Москва, Бережковская наб., 38 стр. 1`,
    });
}

class ObjectsList extends React.Component {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    };

    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    };

    onSelectChange = (selectedRowKeys: any) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    render() {
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div>
                <div >

                    <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
                </div>
                <Table scroll={{ y: 'calc(100vh - 382px)' }}  rowSelection={rowSelection} columns={columns} dataSource={data} />
            </div>
        );
    }
}

export default ObjectsList
