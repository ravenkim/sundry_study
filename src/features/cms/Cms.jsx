import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Board from "src/features/cms/board/Board.jsx";
import Content from "src/features/cms/content/Content.jsx";
import {cmsAction} from "src/features/cms/cmsReducer.jsx";

const Cms = () => {
    const dispatch = useDispatch()

    const {
        path,
    } = useSelector(({router, cmsReducer}) => ({
            path: router.location.pathname,
        }),
        shallowEqual
    )


    // 페이지 나가면  cms 데이터초기화
    useEffect(() => {
        return () => {
            dispatch(cmsAction.initializeAll())
        }
    }, []);



    //url에 따라서 분기
    const [location, setLocation] = useState('')
    useEffect(() => {
        if (path) {
            setLocation(path.split('/')[1])
        }
    }, [path]);


    return (
        <>
            {location === 'board' &&
                <Board/>
            }
            {location === 'content' &&
                <Content/>
            }
        </>
    );
};

export default Cms;
