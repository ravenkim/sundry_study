/**
 * 시간 : 2022-01-11
 * 작성자 : 김명훈
 **/

import React from 'react'
import { List, Tooltip } from 'antd'

const LimeSubjectRank = ({ items, onClick = () => {} }) => {
  return (
    <>
      {/*TOP {!items?"-":items.length}*/}
      <div className="title">주요 과제</div>
      <div style={{ height: '750px', overflowY: 'scroll' }}>
        <List
          itemLayout="horizontal"
          dataSource={items}
          renderItem={(item, index) => (
            <Tooltip title={item.korPjtNm} placement={"left"}>
              <List.Item onClick={() => onClick(item)} style={{ cursor: 'pointer' }}>
                <List.Item.Meta
                  avatar={<div style={{ width: '20px', textAlign: 'left', marginLeft: '5px' }}>{index + 1}</div>}
                  title={<div
                    style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {item.korPjtNm}
                  </div>}
                />
              </List.Item>
            </Tooltip>
          )}
        />
      </div>
    </>
  )
}

export default LimeSubjectRank
