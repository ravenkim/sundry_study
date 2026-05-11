import React from "react";
import { Spin } from "antd";

/**
 * 시간 : 2021-11-17
 * 작성자 : 김명훈
 *
 * @param title 타이틀 입력
 * @param color 해당 범위 색상 default : gray
 * @param keywords 표출될 키워드 목록
 * @param keywordsChangeHandler 키워드 제거시 이벤트 동작 발생 Handler
 * @param onKeywordClickHandler 토픽맵 키워드 등록 이벤트 Handler
 * @param loading spin 상태 변수
 *
 **/

const LimeKeywordsWrap = ({
  title,
  color = "gray",
  keywords,
  keywordsChangeHandler,
  loading,
  onKeywordClickHandler = (word) => {},
}) => {
  return (
    <div className={`con-box-${color}`}>
      <h4>{title}</h4>
      <ul>
        {keywords &&
          keywords.map((keyword,index) => (
            <li key={index}>
              <label
                style={{ cursor: "pointer" }}
                onClick={() => onKeywordClickHandler(keyword)}
              >
                {keyword}
              </label>
              <a title="삭제" onClick={() => keywordsChangeHandler(keyword)}>
                <em className="hidden">삭제</em>
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default LimeKeywordsWrap;
