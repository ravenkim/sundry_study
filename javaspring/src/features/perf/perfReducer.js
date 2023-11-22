/**
 * 시간 : 2022-03-16
 * 작성자 :
 **/
import {
  createActionState,
  createRequestSaga, handleAsyncAction,
  reducerUtils,
} from 'utils/asyncUtils'
import * as perfAPI from 'features/perf/perfApi'
import { takeLatest } from 'redux-saga/effects'
import { createSlice } from '@reduxjs/toolkit'

const prefix = 'perf'

const GET_PRODUCT_LIST = 'perf/getProductList'
const GET_PI_LIST = 'perf/getPiList'
const GET_PRODUCT_PI_LIST = 'perf/getProductPiList'
const GET_COMP_PRD_LIST = 'perf/getCompProdList'
const INSERT_PRODUCT = 'perf/insertProduct'
const UPDATE_PRODUCT = 'perf/updateProduct'
const DELETE_PRODUCT = 'perf/deleteProduct'
const GET_UNIT_INPUTBOX_LIST = 'perf/getUnitInputboxList'
const INSERT_PI_REQUEST_DATA = 'perf/insertPiRequestData'
const INSERT_PRODUCT_PI = 'perf/insertProductPi'
const UPDATE_PRODUCT_PI = 'perf/updateProductPi'
const DELETE_PRODUCT_PI = 'perf/deleteProductPi'
const INSERT_UNIT = 'perf/insertUnit'
const UPDATE_UNIT = 'perf/updateUnit'
const DELETE_UNIT = 'perf/deleteUnit'
const INSERT_COMP_PRD = 'perf/insertCompPrd'
const UPDATE_COMP_PRD = 'perf/updateCompPrd'
const DELETE_COMP_PRD = 'perf/deleteCompPrd'
const UPDATE_PI = 'perf/updatePi'
const UPDATE_ALL_PI = 'perf/updateAllPi'
const GET_PI_CODE_LIST = 'perf/getPiCodeList'
const GET_PRD_CLASS_CD_LIST = 'perf/getPrdClassCdList'
const UPLOAD_PI_TEMPLATE = 'perf/uploadPiTemplate'
const GET_PI_PROPOSE_LIST = 'perf/getPiProposeList'

const initialState = {
  productList: reducerUtils.init(),
  piList: reducerUtils.init(),
  productPiList: reducerUtils.init(),
  compProList: reducerUtils.init(),
  productStatus: reducerUtils.init(),
  unitInputboxList: reducerUtils.init(),
  piRequestStatus: reducerUtils.init(),
  productPiStatus: reducerUtils.init(),
  compProdStatus: reducerUtils.init(),
  unitStatus: reducerUtils.init(),
  piStatus: reducerUtils.init(),
  piCodeList: reducerUtils.init(),
  prdClassCdList: reducerUtils.init(),
  uploadPiStatus: reducerUtils.init(),
  piProposeList: reducerUtils.init(),
}

const defaultState = {
  [GET_PRODUCT_LIST]: 'productList',
  [GET_PI_LIST]: 'piList',
  [GET_PRODUCT_PI_LIST]: 'productPiList',
  [GET_COMP_PRD_LIST]: 'compProList',
  [INSERT_PRODUCT]: 'productStatus',
  [UPDATE_PRODUCT]: 'productStatus',
  [DELETE_PRODUCT]: 'productStatus',
  [GET_UNIT_INPUTBOX_LIST]: 'unitInputboxList',
  [INSERT_PI_REQUEST_DATA]: 'piRequestStatus',
  [GET_PI_PROPOSE_LIST]: 'piProposeList',
  [INSERT_PRODUCT_PI]: 'productPiStatus',
  [UPDATE_PRODUCT_PI]: 'productPiStatus',
  [DELETE_PRODUCT_PI]: 'productPiStatus',
  [INSERT_UNIT]: 'unitStatus',
  [UPDATE_UNIT]: 'unitStatus',
  [DELETE_UNIT]: 'unitStatus',
  [INSERT_COMP_PRD]: 'compProdStatus',
  [UPDATE_COMP_PRD]: 'compProdStatus',
  [DELETE_COMP_PRD]: 'compProdStatus',
  [UPDATE_PI]: 'piStatus',
  [UPDATE_ALL_PI]: 'piStatus',
  [GET_PI_CODE_LIST]: 'piCodeList',
  [GET_PRD_CLASS_CD_LIST]: 'prdClassCdList',
  [UPLOAD_PI_TEMPLATE]: 'uploadPiStatus'
}

export const getProductListSaga = createRequestSaga(GET_PRODUCT_LIST, perfAPI.getProductList)
export const getPiListSaga = createRequestSaga(GET_PI_LIST, perfAPI.getPiList)
export const getProductPiListSaga = createRequestSaga(GET_PRODUCT_PI_LIST, perfAPI.getProductPiList)
export const getCompProdListSaga = createRequestSaga(GET_COMP_PRD_LIST, perfAPI.getCompProdList)
export const insertProductSaga = createRequestSaga(INSERT_PRODUCT, perfAPI.insertProduct)
export const updateProductSaga = createRequestSaga(UPDATE_PRODUCT, perfAPI.updateProduct)
export const deleteProductSaga = createRequestSaga(DELETE_PRODUCT, perfAPI.deleteProduct)
export const getUnitInputboxListSaga = createRequestSaga(GET_UNIT_INPUTBOX_LIST, perfAPI.getUnitInputboxList)
export const insertPiRequestDataSaga = createRequestSaga(INSERT_PI_REQUEST_DATA, perfAPI.insertPiRequestData)
export const insertProductPiSaga = createRequestSaga(INSERT_PRODUCT_PI, perfAPI.insertProductPi)
export const updateProductPiSaga = createRequestSaga(UPDATE_PRODUCT_PI, perfAPI.updateProductPi)
export const deleteProductPiSaga = createRequestSaga(DELETE_PRODUCT_PI, perfAPI.deleteProductPi)
export const insertUnitSaga = createRequestSaga(INSERT_UNIT, perfAPI.insertUnit)
export const updateUnitSaga = createRequestSaga(UPDATE_UNIT, perfAPI.updateUnit)
export const deleteUnitSaga = createRequestSaga(DELETE_UNIT, perfAPI.deleteUnit)
export const insertCompPrdSaga = createRequestSaga(INSERT_COMP_PRD, perfAPI.insertCompPrd)
export const updateCompPrdSaga = createRequestSaga(UPDATE_COMP_PRD, perfAPI.updateCompPrd)
export const deleteCompPrdSaga = createRequestSaga(DELETE_COMP_PRD, perfAPI.deleteCompPrd)
export const updatePiSaga = createRequestSaga(UPDATE_PI, perfAPI.updatePi)
export const updateAllPiSaga = createRequestSaga(UPDATE_ALL_PI, perfAPI.updateAllPi)
export const getPiCodeListSaga = createRequestSaga(GET_PI_CODE_LIST, perfAPI.getPiCodList)
export const getPrdClassCdListSaga = createRequestSaga(GET_PRD_CLASS_CD_LIST, perfAPI.getPrdClassCdList)
export const uploadPiTemplateSaga = createRequestSaga(UPLOAD_PI_TEMPLATE, perfAPI.uploadPiTemplate)
export const getPiProposeListSaga = createRequestSaga(GET_PI_PROPOSE_LIST, perfAPI.getPiProposeList)

export function * perfSaga () {
  yield takeLatest(GET_PRODUCT_LIST, getProductListSaga)
  yield takeLatest(GET_PI_LIST, getPiListSaga)
  yield takeLatest(GET_PRODUCT_PI_LIST, getProductPiListSaga)
  yield takeLatest(GET_COMP_PRD_LIST, getCompProdListSaga)
  yield takeLatest(INSERT_PRODUCT, insertProductSaga)
  yield takeLatest(UPDATE_PRODUCT, updateProductSaga)
  yield takeLatest(DELETE_PRODUCT, deleteProductSaga)
  yield takeLatest(GET_UNIT_INPUTBOX_LIST, getUnitInputboxListSaga)
  yield takeLatest(INSERT_PI_REQUEST_DATA, insertPiRequestDataSaga)
  yield takeLatest(INSERT_PRODUCT_PI, insertProductPiSaga)
  yield takeLatest(UPDATE_PRODUCT_PI, updateProductPiSaga)
  yield takeLatest(DELETE_PRODUCT_PI, deleteProductPiSaga)
  yield takeLatest(INSERT_UNIT, insertUnitSaga)
  yield takeLatest(UPDATE_UNIT, updateUnitSaga)
  yield takeLatest(DELETE_UNIT, deleteUnitSaga)
  yield takeLatest(INSERT_COMP_PRD, insertCompPrdSaga)
  yield takeLatest(UPDATE_COMP_PRD, updateCompPrdSaga)
  yield takeLatest(DELETE_COMP_PRD, deleteCompPrdSaga)
  yield takeLatest(UPDATE_PI, updatePiSaga)
  yield takeLatest(UPDATE_ALL_PI, updateAllPiSaga)
  yield takeLatest(GET_PI_CODE_LIST, getPiCodeListSaga)
  yield takeLatest(GET_PRD_CLASS_CD_LIST, getPrdClassCdListSaga)
  yield takeLatest(UPLOAD_PI_TEMPLATE, uploadPiTemplateSaga)
  yield takeLatest(GET_PI_PROPOSE_LIST, getPiProposeListSaga)
}

export const perfSlice = createSlice({
  // 액션 타입 문자열의 prefix
  name: prefix,

  // 초기값
  initialState,

  // 리듀서
  reducers: {
    initializeAll: (state, action) => {
      return initialState
    },
    initialize: (state, action) => {
      return {
        ...state,
        [action.payload]: reducerUtils.init(),
      }
    },
    getProductList: (state, action) => {},
    getPiList: (state, action) => {},
    getProductPiList: (state, action) => {},
    getCompProdList: (state, action) => {},
    insertProduct: (state, action) => {},
    updateProduct: (state, action) => {},
    deleteProduct: (state, action) => {},
    getUnitInputboxList: (state, action) => {},
    insertPiRequestData: (state, action) => {},
    insertProductPi: (state, action) => {},
    updateProductPi: (state, action) => {},
    deleteProductPi: (state, action) => {},
    insertUnit: (state, action) => {},
    updateUnit: (state, action) => {},
    deleteUnit: (state, action) => {},
    insertCompPrd: (state, action) => {},
    updateCompPrd: (state, action) => {},
    deleteCompPrd: (state, action) => {},
    updatePi: (state, action) => {},
    updateAllPi: (state, action) => {},
    getPiCodeList: (state, action) => {},
    getPrdClassCdList: (state, action) => {},
    uploadPiTemplate: (state, action) =>{},
    getPiProposeList: (state, action) =>{}
  },
  // 서버통신 reducer
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return action.type.includes(prefix)
      },
      (state, action) => {

        state[createActionState(action, defaultState)] =
          handleAsyncAction(action)
      }
    )
  },
})

export const perfAction = perfSlice.actions
