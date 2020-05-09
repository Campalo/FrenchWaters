import React from "react";
import { List, Avatar, Button } from 'antd';


function DepartementList({departements, showStations}) {
    return (
      <List
        itemLayout="horizontal"
        dataSource={departements}
        renderItem={dept => ( // Equal to: departements.map( dept => <li>{dept.code}-{dept.nom}</li>)
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
    )
  };

  export default DepartementList;