import client from "api/client";


export const getCmpnList = (formData) => client.post('/tipa/get_cmpn_list',formData);

export const getCmpnSbjt = (formData) => client.post('/tipa/get_cmpn_sbjt', formData);

export const getSbjt = (formData) => client.post('/tipa/get_sbjt', formData);

export const updateCmpnDesc = (formData) => client.post('/tipa/update_cmpn_desc', formData);

export const submitBusinessPlan = (formData) => client.post('/tipa/submit_business_plan', formData);

export const getEvalAncmList = (formData) => {
    return client.post("/tipa/get_eval_ancm_list", formData);
};

export const getAncmCmitList = (formData) => {
    return client.post("/tipa/get_ancm_cmit_list", formData);
};

export const getEvalSbjt = (formData) => {
    return client.post('/tipa/get_ecmit_sbjt_list', formData);
};

export const getOrgnList = (formData) => {
    return client.post("/tipa/get_pre_eval_result", formData);
};

export const getSbjtPreEvalList = (formData) => {
    return client.post("/tipa/get_sbjt_pre_eval_list", formData);
};

export const getSbjtPreEvalPopup = (formData) => {
    return client.post("/tipa/get_sbjt_pre_eval_popup", formData);
};

export const getPemCommCd = (formData) => {
    return client.post("/tipa/get_pem_comm_cd", formData);
};