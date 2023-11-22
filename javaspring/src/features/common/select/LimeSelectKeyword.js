import React from "react";
import WordcloudChart from "features/chart/components/WordcloudChart";

/**
 * 시간 : 2021-12-21
 * 작성자 : 김동현
 * @param selectData 선택 키워드 데이터, array, state
 * @param setSelectData setState
 * @param removeData 제거 키워드 데이터, array, state
 * @param setRemoveData setState
 *
 * 활용 예시: SearchKeywordResult.js  68 ~ 73 line
 *
 **/

const LimeSelectKeyword = (
  {
    selectData,
    setSelectData,
    removeData,
    setRemoveData,
  }) => {

  const onRemove = (data, setData, item) => {
    setData(data.filter(keyword => keyword !== item));
  };

  return (
    <>
      <div className="keyworld-filter">
        <div className="con-box-gray">
          <h4>제거 키워드</h4>
          <ul>
            {removeData &&
            removeData.map(item =>
              <li>{item}
                <a
                  title="삭제"
                  onClick={() => onRemove(removeData, setRemoveData, item)}
                >
                  <em className="hidden">삭제</em>
                </a>
              </li>
            )
            }
          </ul>
        </div>
        <div className="con-box-blue">
          <h4>선택 키워드</h4>
          <ul>
            {selectData &&
            selectData.map(item =>
              <li>{item}
                <a
                  title="삭제"
                  onClick={() => onRemove(selectData, setSelectData, item)}
                >
                  <em className="hidden">삭제</em>
                </a>
              </li>
            )
            }
          </ul>
        </div>
      </div>
    </>
  )
};

export default LimeSelectKeyword;