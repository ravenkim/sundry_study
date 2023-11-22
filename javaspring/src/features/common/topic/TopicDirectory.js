import React, { useEffect, useRef, useState } from "react";
import { Spin } from 'antd'

/**
 * 시간 : 2021-12-08
 * 작성자 : 김명훈
 **/

const TopicDirectory = ({
  title,
  dataSource,
  id = "user",
  topicDeleteHandler = () => {},
  topicPreviewHandler = () => {},
  topicCheckClickHandler = () => {},
  topicManageClickHandler = () => {},
  topicShareHandler = null,
  manageItem = null,
  checkedItem = null
}) => {
  const [close, setClose] = useState(true);
  useEffect(()=>{
    if(dataSource && dataSource.length===0)
      setClose(true)
  },[dataSource])
  return (
    <>

      <li onMouseLeave={() => topicManageClickHandler(false)}>
        <strong className={!close ? "open-folder" : "folder"}>{title}</strong>
        {dataSource && dataSource.length !== 0 && (
          <a
            className={!close ? "btn-up" : "btn-down"}
            title={!close ? "닫기" : "열기"}
            onClick={() => {
              topicManageClickHandler(false);
              setClose((value) => !value);
            }}
          >
            <em className="hidden">title={!close ? "닫기" : "열기"}</em>
          </a>
        )}
        <ul className={close ? "display-none" : null}>
          {dataSource &&
            dataSource.map((topic, index) => {
              return (
                <li
                  key={index}
                  className={
                    checkedItem === id + topic.topic_id ? "active" : null
                  }
                >
                  <a
                    className="topic-explain"
                    onClick={(e) =>
                      topicCheckClickHandler(id + topic.topic_id, topic)
                    }
                  >
                    <strong>{topic.topic}</strong>
                    <span>{topic.topic_description}</span>
                  </a>
                  <a
                    className="btn-control"
                    title="관리"
                    onClick={() =>
                      topicManageClickHandler(
                        !(manageItem === topic.topic_id),
                        topic
                      )
                    }
                  >
                    <em className="hidden">관리</em>
                  </a>
                  {manageItem === topic.topic_id && (
                    <div className="topic-control-wrap">
                      <h6>관리</h6>
                      <ul>
                        {topicShareHandler && (
                          <li className="icon-globe">
                            공개여부
                            <div className="switch-button">
                              <input
                                type="checkbox"
                                id={"TS" + id + topic.topic_id}
                                defaultChecked={topic.open_yn === "Y"}
                                onChange={(e) => topicShareHandler(e, topic)}
                              />
                              <label htmlFor={"TS" + id + topic.topic_id}>
                                Toggle
                              </label>
                            </div>
                          </li>
                        )}
                        <li
                          className="icon-image"
                          onClick={() => topicPreviewHandler(topic)}
                        >
                          <a>미리보기</a>
                        </li>
                        <li
                          className="icon-trash"
                          onClick={() => topicDeleteHandler(topic)}
                        >
                          <a>삭제하기</a>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
      </li>

    </>
  );
};

export default TopicDirectory;
