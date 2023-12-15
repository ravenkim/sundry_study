import React from 'react';
import {useDispatch} from "react-redux";
import SSeditor from "../../../../common/components/editor/SSeditor.jsx";

const AdminBoard = () => {

    const dispatch = useDispatch();

    return (
        <div>
            <SSeditor/>
        </div>
    );
};

export default AdminBoard;
