import { call, put } from "redux-saga/effects";
import { HTTP_ERROR_MSG } from "Constants";

/**
 * reducer에서 수행할 action을 정의
 * @param type
 * @returns {{success: string, error: string}}
 */
export const reducerUtils = {
  init: () => ({
    data: null,
    loading: false,
    error: false,
    errorMessage: null,
  }),

  loading: (prevData = null) => ({
    data: prevData,
    loading: true,
    error: false,
    errorMessage: null,
  }),

  success: (data = null) => ({
    data: data,
    loading: false,
    error: false,
    errorMessage: null,
  }),

  error: (error) => ({
    data: null,
    loading: false,
    error: true,
    errorMessage: error.msg,
  }),
};

/**
 * type 을 전달받아 data 처리방법 분기
 * @param type
 * @returns {{success: string, error: string}}
 */
export const handleAsyncAction = ({ type, payload = {} }, prevData = null) => {
  if (type.includes("Success")) return reducerUtils.success(payload.data);
  if (type.includes("Error")) return reducerUtils.error(payload);
  return reducerUtils.loading(prevData); // 3.
};

/**
 * type을 전달받아 suffix로 Success, Error를 붙인다.
 * @param type
 * @returns {{success: string, error: string}}
 */
export const createActionString = (type) => {
  return { success: `${type}Success`, error: `${type}Error` };
};

/**
 * Saga를 통해 비동기 통신시 수행할 action정의
 * @param type
 * @param promiseCreator
 * @param stateType
 * @returns {(function(*): Generator<SimpleEffect<"CALL", CallEffectDescriptor<* extends ((...args: any[]) => SagaIterator<infer RT>) ? RT : (* extends ((...args: any[]) => Promise<infer RT>) ? RT : (* extends ((...args: any[]) => infer RT) ? RT : never))>>|SimpleEffect<"CALL", CallEffectDescriptor<{[P in string]: (this:Ctx, ...args: any[]) => any}[string] extends ((...args: any[]) => SagaIterator<infer RT>) ? RT : ({[P in string]: (this:Ctx, ...args: any[]) => any}[string] extends ((...args: any[]) => Promise<infer RT>) ? RT : ({[P in string]: (this:Ctx, ...args: any[]) => any}[string] extends ((...args: any[]) => infer RT) ? RT : never))>>|SimpleEffect<"CALL", CallEffectDescriptor<(this:unknown, ...args: any[]) => any extends ((...args: any[]) => SagaIterator<infer RT>) ? RT : ((this:unknown, ...args: any[]) => any extends ((...args: any[]) => Promise<infer RT>) ? RT : ((this:unknown, ...args: any[]) => any extends ((...args: any[]) => infer RT) ? RT : never))>>|SimpleEffect<"PUT", PutEffectDescriptor<{payload: {[p: string]: *}|*, type: string}>>|SimpleEffect<"PUT", ChannelPutEffectDescriptor<unknown>>|SimpleEffect<"PUT", PutEffectDescriptor<{payload: {msg, stateType: null}|{msg}, type: string, error: boolean}>>, void, *>)|*}
 */
export const createRequestSaga = (type, request) => {
  const { success, error } = createActionString(type);

  return function* (action) {
    const target =
      action.payload && action.payload.target ? action.payload.target : null;
    try {
      const response = yield call(request, action.payload);

      const payload = target ? { ...response, target } : response; // 1.

      yield put({
        type: success,
        error: false,
        payload,
      });
    } catch (err) {
      const payload = target
        ? { msg: HTTP_ERROR_MSG[err.response.status], target }
        : { msg: HTTP_ERROR_MSG[err.response.status] }; // 2.

      if(error==="user/loginError" && err.response.status===401){
        payload.msg = HTTP_ERROR_MSG[401_1];
      }
      yield put({
        type: error,
        error: true,
        payload,
      });
    }
  };
};

/**
 *
 * @param action
 * @param defaultState
 * @returns {null}
 */
export const createActionState = (action, defaultState) => {
  let actionState = null;

  if (action && defaultState) {
    if (action.payload && action.payload.target) {
      actionState = action.payload.target;
    } else {
      for (let stateKey in defaultState) {
        if (action.type && action.type.startsWith(stateKey)) {
          actionState = defaultState[stateKey];
        }
      }
    }
  }
  return actionState;
};
