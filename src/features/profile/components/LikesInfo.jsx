import React from 'react';
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
