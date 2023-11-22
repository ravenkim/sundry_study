import React from "react";
import LimeLayout from "features/common/layout/components/LimeLayout";
import CommCond from "features/admin/cond/CommCond";

const ManageCondPage = () => {
  return (
    <LimeLayout title={"평가위원조건관리"}>
      <CommCond />
    </LimeLayout>
  );
};

export default ManageCondPage;
