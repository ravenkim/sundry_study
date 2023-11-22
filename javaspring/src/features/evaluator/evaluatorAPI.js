import client from "api/client";

// 세부사업, 내역사업, 내내역사업 조회
export const getBrdnBuclCd = (formData) => {
    return client.post("/tipa/get_brdn_bucl_cd", formData);
};

// 사업공고 조회
export const getAncmList = (formData) => {
    return client.post("/tipa/get_ancm_list", formData);
};

// 평가위원 추천 조건 조회
export const getEvaluatorCondition = (formData) => {
    return client.post("/tipa/get_evaluator_condition", formData);
};

// 분과목록 조회
export const getCmitList = (formData) => {
    return client.post("/tipa/get_cmit_list", formData);
};

// 분과 과제, 평가위원조회
export const getCmitDetail = (formData) => {
    return client.post("/tipa/get_cmit_detail", formData);
};

// 평가위원 상세정보 조회
export const getCmitMbrDetail = (formData) => {
    return client.post("/tipa/get_cmit_mbr_detail", formData);
};

// 분과 생성 및 배정
export const assignEvaluator = (formData) => {
    return client.post("/tipa/assign_evaluator", formData);
};

// 분과 재생성 및 재배정
export const reAssignEvaluator = (formData) => {
    return client.post("/tipa/re_assign_evaluator", formData);
};