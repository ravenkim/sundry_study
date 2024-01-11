import React from 'react';
import {useDispatch} from "react-redux";
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
