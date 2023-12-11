import React from 'react';
import SSsearchInput from "../../common/components/input/SSsearchInput.jsx";

const Door = () => {
    return (
        <>
            <SSsearchInput
                title={'무엇을 찾으시나요?'}
                placeholder={'전체 항목에서 검색합니다'}
            />

            <div
                style={{
                    width: '800px'
                }}
            >
                원하는 서비스로 가장 빠르게 이동해 보세요.

            </div>
        </>
    );
};

export default Door;
