import React, {useEffect} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import ProfileLikeTable from "./board/ProfileLikeTable.jsx";

const LikesInfo = () => {
    return(
        <>
            <div className={'w-full flex flex-col'}>
                <ProfileLikeTable/>
            </div>
        </>
    )
}

export default LikesInfo
