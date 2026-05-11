import React from "react";
import { List, Tooltip } from "antd";

const NodeList = ({
  dataSource,
  loading,
  itemClickHandler,
  pagination,
  itemClassName,
}) => {
  return (
    <List
      dataSource={dataSource}
      loading={loading}
      pagination={pagination ? pagination : { size: "small" }}
      renderItem={(item) => (
        <List.Item
          className={itemClassName}
          onClick={(e) => itemClickHandler(item)}
        >
          <List.Item.Meta
            // title={item.title}
            description={
              <Tooltip placement={"right"} title={item.title}>
                <div className={"rome_socio_node_title"}>
                  <span>{item.title}</span>
                </div>
              </Tooltip>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default NodeList;
