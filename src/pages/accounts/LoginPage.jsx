import Background from "/src/common/components/layout/components/Background.jsx";
import Login from "/src/features/accounts/Login.jsx";
import {useRef, useEffect, useState} from 'react';

const LoginPage = () => {


    //브라우저 가로 길이
    const width = window.innerWidth

    return (

        <Background>

            <Login/>


        </Background>
    );
};

export default LoginPage;
