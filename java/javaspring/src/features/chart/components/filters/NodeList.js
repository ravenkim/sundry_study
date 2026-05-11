import React, { useEffect } from "react";
import { List, Spin, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";

const NodeList = ({ docIds, itemClickHandler }) => {
  const dispatch = useDispatch();

  const { docList, docListLoading } = useSelector(({ searchReducer }) => ({
    // docList: searchReducer.docList.data,
    // docListLoading: searchReducer.docList.loading,
  }));

  useEffect(() => {
    if (docIds && docIds.length > 0) {
      // dispatch(
      //   searchAction.getDocList({
      //     docIds: docIds,
      //   })
      // );
    }
  }, [docIds]);

  return (
    <Spin spinning={docListLoading}>
      {docList && (
        <List
          itemLayout="horizontal"
          dataSource={docList}
          renderItem={(item, index) => (
            <Tooltip title={item.korPjtNm} placement={"left"}>
              <List.Item
                onClick={() => itemClickHandler(item)}
                style={{ cursor: "pointer" }}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      style={{
                        width: "20px",
                        textAlign: "left",
                        marginLeft: "5px",
                      }}
                    >
                      {index + 1}
                    </div>
                  }
                  title={
                    <div
                      style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {item.korPjtNm}
                    </div>
                  }
                />
              </List.Item>
            </Tooltip>
          )}
        />
      )}
    </Spin>
  );
};

export default NodeList;
