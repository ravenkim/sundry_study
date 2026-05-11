import React from "react";
import LimeLayout from "features/common/layout/components/LimeLayout";
import CommPref from "features/admin/perf/CommPerf";

const ManagePerfPage = () => {
  return (
    <LimeLayout title={"성능지표관리"}>
      <CommPref />
    </LimeLayout>
  );
};

export default ManagePerfPage;
