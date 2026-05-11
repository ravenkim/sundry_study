import React from "react";
import LimeLayout from "../../features/common/layout/components/LimeLayout";
import CommMenu from "features/admin/menu/CommMenu";

const ManageMenuPage = () => {
  return (
    <LimeLayout title={"메뉴/접근권한관리"}>
      <CommMenu/>
    </LimeLayout>
    );
};

export default ManageMenuPage;
