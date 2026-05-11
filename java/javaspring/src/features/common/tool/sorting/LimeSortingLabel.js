import React, {useEffect, useState} from 'react';
import {ORDERING} from "Constants";

const LimeSortingLabel = ({targetKey, label, labelStyle, sortingChangeHandler, defaultSorting = ORDERING.DEFAULT }) => {

    const [sortingStatus, setSortingStatus] = useState(defaultSorting);

    const ascBtnClickHandler = () => {
        setSortingStatus(sortingStatus===ORDERING.ASC ? ORDERING.DEFAULT : ORDERING.ASC);
    };

    const descBtnClickHandler = () => {
        setSortingStatus(sortingStatus===ORDERING.DESC ? ORDERING.DEFAULT : ORDERING.DESC);
    };


    useEffect(()=>{
        if(sortingChangeHandler && typeof sortingChangeHandler === "function"){
            sortingChangeHandler(targetKey, sortingStatus);
        }
    },[sortingStatus])

    return (
        <div className="sort-icon-toggle">
            <label style={{...labelStyle}}>{label}</label>
            <div className="sort-icons">
                <label className={`sort-up ${sortingStatus===ORDERING.ASC ? "active-up" : ""}`}
                        onClick={ascBtnClickHandler}></label>
                <label className={`sort-down ${sortingStatus===ORDERING.DESC ? "active-down" : ""}`}
                        onClick={descBtnClickHandler}></label>
            </div>
        </div>
    );
};

export default LimeSortingLabel;