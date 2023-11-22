/**
 * 시간 : 2022-03-16
 * 작성자 : 김명훈
 **/


import client from "api/client";

export const getProductList = (params) =>
  client.get(`/tipa/get_product_list?sbjt_id=${params.sbjt_id}`);

export const getPiList = (params) =>
  client.get(`/tipa/get_pi_list?search_keyword=${params.search_keyword}&confirm_state=${params.confirm_state}`);

export const getProductPiList = (params) =>
  client.get(`/tipa/get_product_pi_list?product_id=${params.product_id}`);

export const getCompProdList = (params) =>
  client.get(`/tipa/get_comp_prd_list?product_id=${params.product_id}`);

export const insertProduct = (params) =>
  client.post(`/tipa/insert_product`,params);

export const updateProduct = (params) =>
  client.post(`/tipa/update_product`,params);

export const deleteProduct = (params) =>
  client.post(`/tipa/delete_product`,params);

export const getUnitInputboxList = (params) =>
  client.get(`/tipa/get_unit_inputbox_list${params&&params.search_keyword?`?search_keyword=${params.search_keyword}`:""}`);

export const insertPiRequestData = (params) =>
  client.post(`/tipa/insert_pi_request_data`,params);

export const insertProductPi = (params) =>
  client.post(`/tipa/insert_product_pi`,params);

export const updateProductPi = (params) =>
  client.post(`/tipa/update_product_pi`,params);

export const deleteProductPi = (params) =>
  client.post(`/tipa/delete_product_pi`,params);

export const insertUnit = (params) =>
  client.post(`/tipa/insert_unit`,params);

export const updateUnit = (params) =>
  client.post(`/tipa/update_unit`,params);

export const deleteUnit = (params) =>
  client.post(`/tipa/delete_unit`,params);

export const insertCompPrd = (params) =>
  client.post(`/tipa/insert_comp_prd`,params);

export const updateCompPrd = (params) =>
  client.post(`/tipa/update_comp_prd`,params);

export const deleteCompPrd = (params) =>
  client.post(`/tipa/delete_comp_prd`,params);

export const updatePi = (params) =>
  client.post(`/tipa/update_pi`,params);

export const updateAllPi = (params) =>
  client.post(`/tipa/update_all_pi`,params);

export const getPiCodList = (params) =>
  client.get(`/tipa/get_pi_code_list`);

export const getPrdClassCdList = (params) =>
  client.get(`/tipa/get_prd_class_cd_list?prd_class_cd_id=`+params.prd_class_cd_id);

export const uploadPiTemplate = (params) =>
  client.post('/tipa/upload_pi_template',params)

export const getPiProposeList = () =>
  client.get('/tipa/get_pi_propose_list')
