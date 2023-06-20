import { catActions } from 'features/cat/catReducer';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Cat = () => {
    const { 
        cat
    } = useSelector(({catReducer}) => ({
        cat: catReducer.data
    }))

    const dispatch =  useDispatch()



    const btnclick = () => {
        dispatch(catActions.getCatsFectch())
    }
  

    return (
        <>
            <div>{JSON.stringify(cat)}</div>
            <button
                onClick={() => btnclick()}
            >aaaaa</button>
        </>
    );
};

export default Cat;