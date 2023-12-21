import React from 'react';
import {useDispatch} from "react-redux";
import {adminAction} from "../../adminReducer.jsx";

const AdminDelinquent = () => {
        const dispatch = useDispatch();

    return (
        <button
            onClick={() => dispatch(adminAction.test('aaaa'))}
        >
asdasd
        </button>
    );
};

export default AdminDelinquent;
