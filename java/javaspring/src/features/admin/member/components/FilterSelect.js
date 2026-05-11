import React, {useState} from "react";
import {Select} from 'antd';

const FilterSelect = ({
                          filterList,
                          selectedFilterHandler,
                          searchHandler,
                          autoMigrateHandler,
                          memberInsertButton
                      }) => {
    const {Option} = Select;

    const [word, setWord] = useState("");

    const wordChangeHandler = (e) => {
        setWord(e.target.value);
    };

    const onPressEnter = (e) => {
        if (e.key === "Enter") {
            searchHandler(word);
        }
    };

    const onWordReset = () => {
        setWord("");
    };

    return (
        <>
            <div className="flex-row gap-16 mb-16 items-center">
                <h4>회원 검색</h4>
                <button
                    type="button"
                    className="btn-primary-32 ml-auto plr-40"
                    onClick={autoMigrateHandler}
                    // disabled={disabled}
                >회원정보 동기화
                </button>
                <button
                    type="button"
                    className="btn-primary-32 plr-40"
                    onClick={memberInsertButton}
                    // disabled={disabled}
                >회원 추가
                </button>
            </div>
            <div className="grid-col-4 gap-16">
                <Select
                    className={"col-span-1"}
                    placeholder="선택해주세요."
                    onChange={selectedFilterHandler}
                >
                    {filterList && filterList.map((data) => {
                        return (
                            <Option key={data.key} value={data.key}>{data.value}</Option>
                        )
                    })
                    }
                </Select>
                <div className="col-span-3">
                    {/*검색폼*/}
                    <div className="search-40">
                        <input type="search" placeholder="회원 정보를 입력하세요." onChange={wordChangeHandler} value={word}
                               onKeyPress={onPressEnter}/>
                        <button type="button" className="search-btn" onClick={() => searchHandler(word)}/>
                        <button type="button" className="search-btn-close" onClick={onWordReset}/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilterSelect;
