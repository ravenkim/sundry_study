import React from "react";
import { Tree } from "antd";

const CodeTreeList = ({ dataSource, codeSelectHandler, selectedKeys }) => {
  return (
    <div className="ptb-16 pr-8" style={{height: "calc(100vh - 164px)"}}>
      {dataSource && (
        <Tree
          style={{ height: "calc(100vh - 198px)", overflowY: "auto" }}
          selectedKeys={selectedKeys}
          treeData={dataSource.children}
          showLine={true}
          onSelect={codeSelectHandler}
        />
      )}
    </div>
  );
};

export default CodeTreeList;
