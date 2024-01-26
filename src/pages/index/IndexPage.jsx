import React, {useEffect} from 'react';
import SSlayout from "src/common/components/layout/SSlayout.jsx";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {push} from "redux-first-history";

const IndexPage = () => {


    const dispatch = useDispatch();


    const {
        user
    } = useSelector(({userReducer}) => ({
        user: userReducer.user
    }),
        shallowEqual
        )

    useEffect(() => {
        //로근인 했으면 통과 true 에 user 로 변경 권환 확인
        if(user){
         dispatch(push('/door'))
        } else {
            dispatch(push('/login'))
        }
    }, []);


    return (
        <SSlayout>

        </SSlayout>
    );
};

export default IndexPage;
