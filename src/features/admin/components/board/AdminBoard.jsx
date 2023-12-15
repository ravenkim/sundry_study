import React from 'react';
import {useDispatch} from "react-redux";
import SSeditor from "../../../../common/components/editor/SSeditor.jsx";

const AdminBoard = () => {

    const dispatch = useDispatch();

    return (
            <SSeditor/>
    );
};

export default AdminBoard;
