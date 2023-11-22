import React from 'react';
import LimeLayout from "features/common/layout/components/LimeLayout";
import MyProfile from "features/accounts/MyProfile";

const MyProfilePage = () => {
    return (
        <LimeLayout title={"내 프로필"}>
            <MyProfile/>
        </LimeLayout>
    );
};

export default MyProfilePage;