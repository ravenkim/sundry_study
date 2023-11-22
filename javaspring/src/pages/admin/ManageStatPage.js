import React from "react";
import LimeLayout from "features/common/layout/components/LimeLayout";
import CommStat from "../../features/admin/stat/CommStat";

const ManageStatPage = () => {
  return (
    <LimeLayout title={"기초통계대시보드"}>
      <CommStat />
    </LimeLayout>
  );
};

export default ManageStatPage;
