import React from "react";
import { Tree } from "antd";

const MenuTreeList = ({ dataSource, menuSelectHandler, selectedKeys }) => {
  return (
    <div className="ptb-16 pr-8" style={{height: "calc(100vh - 164px)"}}>
      {dataSource && (
        <Tree
          style={{ height: "calc(100vh - 198px)", overflowY: "auto" }}
          selectedKeys={selectedKeys}
          treeData={dataSource}
          showLine={true}
          onSelect={menuSelectHandler}
        />
      )}
    </div>
  );
};


export default MenuTreeList;
