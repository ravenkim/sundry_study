import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SSeditor from "../../common/components/editor/SSeditor.jsx";
import RentalContentView from "./content/rental/RentalContentView.jsx";
import background from "../../common/components/layout/components/Background.jsx";

const Content = () => {

    const dispatch = useDispatch()


    const {
        path
    } = useSelector(({router}) => ({
            path: router.location?.pathname
        }),
        shallowEqual
    )


    const [editMode, setEditMode] = useState(false)


    const [boardId, setBoardId] = useState(null)
    const [contentId, setContentId] = useState(null)

    useEffect(() => {
        if (path) {
            const data = path.split('/')
            setBoardId(Number(data[2]))
            setContentId(Number(data[3]))

        }

    }, [path]);



    useEffect(() => {
        if(boardId && contentId) {
            // console.log(boardId)
            // console.log(contentId)

        }
    }, [boardId, contentId]);


    const [mode, setMode] = useState()



    return (
       <div
        style={{
            backgroundColor: '#F5F5F5',
            width:' 100%'
       }}
       >


           <RentalContentView/>
            <RentalContentView/>
       </div>
        
        
    );
};

export default Content;
