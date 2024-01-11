import {reducerUtils, reduxMaker} from "src/common/utils/asyncUtils.jsx";
import {getSearchAll} from "./doorAPI.jsx";

const prefix = 'door'


//비동기 처리용 input
const asyncRequest = {
    getSearchAll: [
        {searchResult: reducerUtils.init()},
        getSearchAll
    ],

}




const localState = {
}

//로컬 리듀서
const localReducers = {
}

//이름만 바꿔서 사용
export const {doorSlice, doorSaga, doorAction} = reduxMaker(prefix, asyncRequest, localState, localReducers);


