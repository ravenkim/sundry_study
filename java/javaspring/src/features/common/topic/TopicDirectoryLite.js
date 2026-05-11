import React, { useEffect, useRef, useState } from 'react'

/**
 * 시간 : 2021-12-08
 * 작성자 : 김명훈
 **/

const TopicDirectoryLite = ({
  dataSource,
  id = 'user',
  topicCheckClickHandler = () => {},
  topicDeleteClickHandler = null,
  checkedItem = null,
  categoryList = [],
}) => {
  const findCategory = (topic) => {
    if (topic.type)
      return (
        <div className="classification">
          <span className={'shared-topic'}>{topic.type}</span>
        </div>
      )
    const section = categoryList.find(
      (item) => item.value === topic.cate_cd.substr(0, 2)
    )
    if (!section) return '카테고리 없음'
    const mainClass = section.children.find(
      (item) => item.value === topic.cate_cd.substr(0, 4)
    )
    if (!mainClass) return '카테고리 없음'
    const subClass = mainClass.children.find(
      (item) => item.value === topic.cate_cd.substr(0, 6)
    )
    if (!subClass) return '카테고리 없음'
    return (
      <div className="classification">
        <span>{section.label}</span>
        <span>{mainClass.label}</span>
        <span>{subClass.label}</span>
        <span>({subClass.value})</span>
      </div>
    )
  }
  return (
    <>
      <li>
        <ul>
          {dataSource &&
          dataSource.map((topic, index) => {
            return (
              <li
                key={index}
                className={
                  checkedItem === id + topic.topic_id ? 'active' : null
                }
              >
                <div
                  className="topic-explain"
                  onClick={(e) =>
                    topicCheckClickHandler(id + topic.topic_id, topic)
                  }
                >
                  <div className="topic-explain-top">
                    {findCategory(topic)}
                    {(topicDeleteClickHandler && (topicDeleteClickHandler instanceof Function) &&
                      <a className="btn-trash" title="삭제" onClick={(e) => {
                        topicDeleteClickHandler(topic)
                        e.stopPropagation();
                      }}>
                        <em className="hidden">토픽 모델 삭제</em>
                      </a>)}
                  </div>
                  <strong>{topic.topic}</strong>
                  <span>{topic.topic_description}</span>
                </div>
              </li>
            )
          })}
            </ul>
            </li>
            </>
            )
          }

          export default TopicDirectoryLite
