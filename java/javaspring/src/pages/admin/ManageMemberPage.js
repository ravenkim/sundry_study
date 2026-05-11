import React from "react";
import LimeLayout from "../../features/common/layout/components/LimeLayout";
import CommMember from "features/admin/member/CommMember";

const ManageMemberPage = () => {
  return (
    <LimeLayout title={"사용자/권한관리"}>
      <CommMember/>
    </LimeLayout>
    );
};

export default ManageMemberPage;
