import React, {useEffect} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SSsearchInput from "../../../common/components/input/SSsearchInput.jsx";

const RentalsInfo = () => {
    const dispatch = useDispatch()

    return(
        <>
            <div className={'w-full flex '}>

                <SSsearchInput inputClassName={'h-[40px]'} iconClassName={'h-[20px]'} svgWidth={'16px'} />
            </div>
        </>
    )
}

export default RentalsInfo
