import React, {useState} from 'react';
import SSsearchInput from "../../common/components/input/SSsearchInput.jsx";
import {Input} from "antd";

const Door = () => {

    const [serchAllText, setSerchAllText] = useState()

    return (
        <>
            <SSsearchInput
                value ={serchAllText}
                onChange={(e) => setSerchAllText(e.target.value)}
                     placeholder={'찾고자 하는 항목을 입력하세요. (전체 항목에서 검색됩니다)'}
                title={'무엇을 찾으시나요?'}
            />





            <div
                style={{
                    width: '800px'
                }}
            >
                <h2>원하는 서비스로 가장 빠르게 이동해 보세요.</h2>

            </div>
        </>
    );
};

export default Door;
