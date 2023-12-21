import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import SSeditor from "../../common/components/editor/SSeditor.jsx";

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



    return (
        <div
            style={{
                width: '100%',
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <div

                className={'w-full '}
                style={{
                    backgroundColor: "aqua",
                    display: 'flex',
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: 'center',
                    height: '349px'
                }}

            >
                <div>
                    대충 제목, 사진 넣기
                </div>


            </div>

            <div
                style = {{
                    width: '63%',
                    minHeight: '500px',
                    backgroundColor: "tomato",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <div
                    style={{
                        width: '58%',
                        backgroundColor: "salmon"
                    }}
                >
                    <SSeditor
                        height={'1000px'}
                    />

                </div>

                <div
                    style={{
                            width: '38%',
                            height: '500px',
                            display: "flex",
                            flexDirection: 'column'
                        }}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '350px',
                            backgroundColor: "salmon"
                        }}

                    >
                        대여 머시기 들어가는 공간


                    </div>
                    
                    <div>
                        수정, 삭제 버튼 들어갈 공간
                    </div>
                    
                    
                </div>


            </div>
        </div>
        
        
        
    );
};

export default Content;
