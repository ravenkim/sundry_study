import React, { useState } from 'react'
import { Select } from 'antd';

const TermSelect = (
  {
    searchHandler,
    typeHandler,
    typeData,
    showModal
    
  }) => {

    const [word, setWord] = useState("");

    const wordChange = (e) => {
        setWord(e.target.value);
    };

    const onPressEnter = (e) => {
      if (e.key === "Enter") {
        searchHandler(word);
      }
    };

    const onResetWord = () => {
      setWord("");
    };

    const { Option } = Select;

  return (

    <>
      <h4 className="mb-16">용어 검색</h4>
      <div className="grid-col-6 gap-16">
        <Select
          className={"col-span-1"}
          placeholder="선택해주세요."
          onChange={typeHandler}
        >
          {typeData && typeData.map((data) => {
            return (
              <Option key={data.key} value={data.key}>{data.value}</Option>
            )
          })
          }
        </Select>
        <div className="col-span-2">
          {/*검색폼*/}
          <div className="search-40">
            <input
              type="search"
              value={word}
              onChange={(e) => wordChange(e)}
              onKeyPress={onPressEnter}
            />
            <button type="button" className="search-btn" onClick={() => searchHandler(word)}/>
            <button type="button" className="search-btn-close" onClick={() => onResetWord()}/>
          </div>
        </div>
        <div className="col-span-2"/>
        <div className="col-span-1">
          <button type="button" className="btn-secondary-40 ml-auto plr-40" onClick={showModal}>용어 추가</button>
        </div>
      </div>
    </>
  );
};

export default TermSelect;