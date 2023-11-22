import React from "react";
import LimeLayout from "../../features/common/layout/components/LimeLayout";
import CommTerm from "features/admin/term/CommTerm";

const ManageTermPage = () => {
  return (
    <LimeLayout title={"용어 관리"}>
      <CommTerm/>
    </LimeLayout>
    );
};

export default ManageTermPage;
