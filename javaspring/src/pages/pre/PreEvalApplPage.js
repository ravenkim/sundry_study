import React from 'react';
import LimeLayout from "features/common/layout/components/LimeLayout";
import PreEvalAppl from "features/pre/PreEvalAppl";

const PreEvalApplPage = () => {
    return (
        <LimeLayout title={"신청과제 조회"}>
            <PreEvalAppl/>
        </LimeLayout>
    );
};

export default PreEvalApplPage;