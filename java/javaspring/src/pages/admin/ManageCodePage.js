import React from "react";
import LimeLayout from "features/common/layout/components/LimeLayout";
import CommCode from "features/admin/code/CommCode";

const ManageCodePage = () => {
  return (
    <LimeLayout title={"공통코드관리"}>
      <CommCode />
    </LimeLayout>
  );
};

export default ManageCodePage;
