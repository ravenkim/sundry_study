import React from 'react';
import SSlayout from "src/common/components/layout/SSlayout.jsx";
import SSbutton from "src/common/components/button/SSbutton.jsx";
import El_3 from "src/assets/img/Ellipse 3.png";
import El_2 from "src/assets/img/Ellipse 2.png";
import El_1 from "src/assets/img/Ellipse 1.png";
import {push} from "redux-first-history";
import {useDispatch} from "react-redux";

const ErrorPage = () => {
    const dispatch = useDispatch()


    return (


        <SSlayout
            style={{
                overflow: 'hidden',
                position: 'relative'

            }}
        >
            <img src={El_3} alt="#" className='absolute
            -bottom-[20%] -right-[50%]
            tablet:-bottom-[30%] tablet:-right-[20%]
            desktop:-bottom-[22%] desktop:-right-[10%]'/>
            <img src={El_2} alt="#" className='absolute z-0
            top-[25%] -left-[50%]
            tablet:-top-[25%] tablet:-left-[5%]
            desktop:-top-[360px] desktop:-left-[172px]'/>
            <img src={El_1} alt="#" className='absolute z-1
            -top-[25%] -left-[30%]
            tablet:-top-[40%] tablet:-left-[25%]
            desktop:-top-[15%] desktop:-left-[20%]'/>


            <div
                style={{
                    display: "flex",
                    position: "absolute",
                    flexDirection: 'column',
                    top: "40%"
                }}
            >

                <h1>
                    404

                </h1>

                <h2>잘못된 url로 들어오셨군요!</h2>
                <h2>존재 하지 않는 페이지 입니다.</h2>

                <SSbutton
                    onClick={() => dispatch(push('/'))}

                >
                    홈으로 돌아가기
                </SSbutton>

            </div>


        </SSlayout>


    );
};

export default ErrorPage;
