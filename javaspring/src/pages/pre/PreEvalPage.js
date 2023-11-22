import React from 'react';
import LimeLayout from "features/common/layout/components/LimeLayout";
import PreEval from "features/pre/PreEval";

const PreEvalPage = () => {
    return (
        <LimeLayout title={"예비평가 결과분석"}>
            <PreEval/>
        </LimeLayout>
    );
};

export default PreEvalPage;