import React, {useEffect} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SSsearchInput from "../../../common/components/input/SSsearchInput.jsx";
import ProfileRentalTable from "./board/ProfileRentalTable.jsx";

const RentalsInfo = () => {
    const dispatch = useDispatch()

    return(
        <>
            <div className={'w-full flex flex-col'}>
                <ProfileRentalTable/>
            </div>
        </>
    )
}

export default RentalsInfo
