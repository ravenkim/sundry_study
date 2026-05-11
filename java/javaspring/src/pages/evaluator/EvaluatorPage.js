import React from 'react';
import LimeLayout from "features/common/layout/components/LimeLayout";
import Evaluator from "features/evaluator/Evaluator";

const EvaluatorPage = () => {
    return (
        <LimeLayout title={"평가위원 추천"}>
            <Evaluator/>
        </LimeLayout>
    );
};

export default EvaluatorPage;