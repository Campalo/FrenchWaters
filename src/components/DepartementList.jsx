import React from "react";
import { List, Avatar, Button } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';


function DepartementList({departements, showStations}) {
    return (
        <InfiniteScroll>
            <List
                itemLayout="horizontal"
                dataSource={departements}
                renderItem={dept => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src="https://images.unsplash.com/photo-1541103335697-086d3519c039?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80" />}
                            title={`${dept.code} - ${dept.nom}`}
                            description={`${dept.count} stations`}
                        />
                        <div className="btn-list">
                            <Button onClick={showStations} value={dept.code}>Select</Button>
                        </div>
                    </List.Item>
                )}
            />
        </InfiniteScroll>
    )
  };

  export default DepartementList;