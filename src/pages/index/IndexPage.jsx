import React, {useEffect} from 'react';
import SSlayout from "../../common/components/layout/SSlayout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {push} from "redux-first-history";

const IndexPage = () => {


    const dispatch = useDispatch();


    const {
        user
    } = useSelector(({userReducer}) => ({
        user: userReducer.user?.data
    }))

    useEffect(() => {
        //로근인 했으면 통과 true 에 user 로 변경 권환 확인
        if(true){
         dispatch(push('/door'))
        }
    }, []);


    return (
        <SSlayout>

        </SSlayout>
    );
};

export default IndexPage;
