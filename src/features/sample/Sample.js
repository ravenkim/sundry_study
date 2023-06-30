import { sampleAction } from 'features/sample/sampleReducer';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Sample = () => {
    const { 
        codeList
    } = useSelector(({sampleReducer}) => ({
        codeList: sampleReducer.codeList.data
    }))

    const dispatch =  useDispatch()



    const btnclick = () => {
        dispatch(sampleAction.getCodeList())
    }

    return (
        <>
            <button
                onClick={() => btnclick()}
            >aaaaa</button>
            <p>
            </p>
        </>
    );
};

export default Sample;