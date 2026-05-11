import React, {useState} from "react";
/**
 * 시간 : 2021-11-14
 * 작성자 : 김동현
 * 라임 라디오 버튼
 *  left, right 각각 text,id, onClick 입력
 *  @param checked boolean, default값 true, checked 값 하나만 넣으면 가능
 * */
const LimeRadioButton = (
    {
        leftText,
        rightText,
        leftId,
        rightId,
        leftHandler,
        rightHandler,
    }) => {

    const [checked, setChecked] = useState(true);
    const onChange = () => {
        setChecked(!checked);
    }

    return (
        <div className={"radio-button"}>
            <input type={"radio"} id={leftId} checked={checked} onChange={onChange}/><label htmlFor={leftId} onClick={leftHandler}>{leftText}</label>
            <input type={"radio"} id={rightId} checked={!checked} onChange={onChange}/><label htmlFor={rightId} onClick={rightHandler}>{rightText}</label>
        </div>
    )
}

export default LimeRadioButton;