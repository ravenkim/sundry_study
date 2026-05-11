import React from "react";
import { Drawer, List, Tooltip } from "antd";
import { titleRender } from "features/sna/utils/utils";
import NodeList from "features/sna/components/light/list/NodeList";

const DetailDrawer = ({
  category,
  visible,
  placement,
  dataSource,
  loading,
  closeHandler,
  itemClickHandler,
  footer = null,
  width,
}) => {
  return (
    <Drawer
      width={width}
      placement={placement}
      title={titleRender(category)}
      closable={true}
      onClose={closeHandler}
      visible={visible}
      getContainer={false}
      style={{ position: "absolute", zIndex: 99 }}
      footer={footer}
    >
      <NodeList
        dataSource={dataSource}
        loading={loading}
        pagination={{ size: "small" }}
        itemClickHandler={itemClickHandler}
        itemClassName={"rome_node_item"}
      />
    </Drawer>
  );
};

export default DetailDrawer;
