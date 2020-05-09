
import React from "react";
import { List, Avatar, Button } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';


function StationsListForOneDept({stations, showMeasurements}) {
    return (
        <InfiniteScroll>
            <List
            itemLayout="horizontal"
            dataSource={stations}
            renderItem={station => ( station.nb_mesures_piezo > 0 ?
                <List.Item>
                <List.Item.Meta
                    avatar={<Avatar src="https://images.unsplash.com/photo-1533201357341-8d79b10dd0f0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80" />}
                    title={`Piézomètre de ${station.nom_commune}`}
                    description={station.date_fin_mesure !== null ? `Date du dernier relevé : ${station.date_fin_mesure}` : 'Date non communiquée'}
                    />
                    <div className="btn-list">
                    <Button onClick={() => showMeasurements(station.code_bss, station.nom_commune)}>Select</Button>
                </div>
                </List.Item>
                :
                <div className='hidden'></div> // Do not show the station if it does not have any measurements
                )}
                />
            </InfiniteScroll>
    )
}

  export default StationsListForOneDept;