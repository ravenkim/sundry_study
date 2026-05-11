
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {useState,useEffect} from "react";
import {testAction} from "src/pages/test/testReducer.jsx";
import {getTest} from "src/pages/test/testAPI.jsx";


const Test = () => {

    const dispatch =  useDispatch()



    const {
        test,
        aaa
    } = useSelector(({testReducer}) => ({
            test: testReducer?.num,
            aaa: testReducer?.aaaa,
        }),
        shallowEqual
    );



    return(
        <>
                        <button
                onClick={() => dispatch(testAction.getApi())}

                // 2 = action.payload
                // addnumber =  action.type

            >zzzzzzzzzzz</button>
            {test}
            {JSON.stringify(aaa)}




        </>
    )
}

export default Test