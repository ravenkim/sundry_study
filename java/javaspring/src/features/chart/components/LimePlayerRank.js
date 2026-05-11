
/**
 * 시간 : 2022-01-11
 * 작성자 : 김명훈
 **/

import React, { useEffect } from 'react'
import { List } from 'antd'


const LimePlayerRank = ({items, onClick=()=>{}})=>  {

  return (
    <>
      {/*TOP {!items?"-":items.length}*/}
      <div className="title">주요 수행 기관</div>
      <div style={{ height: '750px', overflowY: 'scroll' }}>
      <List
        itemLayout="horizontal"
        dataSource={items}
        renderItem={(item,index) => (
          <List.Item onClick={()=>onClick(item)} style={{cursor:"pointer"}}>
            <List.Item.Meta
              avatar={<div style={{ width: '20px', textAlign: 'left', marginLeft: '5px' }}>{index + 1}</div>}
              title={<div style={{textOverflow:"ellipsis",whiteSpace:"nowrap", overflow: "hidden"}}>{item.name}</div>}
            />
            <div>{item.docSize}건</div>
          </List.Item>
        )}
      />
      </div>
    </>
  );
}

export default LimePlayerRank;
