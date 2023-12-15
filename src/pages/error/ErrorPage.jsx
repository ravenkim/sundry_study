import React from 'react';
import SSlayout from "src/common/components/layout/SSlayout.jsx";
import SSbutton from "src/common/components/button/SSbutton.jsx";

const ErrorPage = () => {
    return (
        <SSlayout>
            <h1>
                404 
            </h1>
            
            <h2>잘못된 url로 들어오셨군요!</h2>
            <h2>존재 하지 않는 페이지 입니다.</h2>
            
            <SSbutton>
                홈으로 돌아가기
            </SSbutton>
            

        </SSlayout>
    );
};

export default ErrorPage;
