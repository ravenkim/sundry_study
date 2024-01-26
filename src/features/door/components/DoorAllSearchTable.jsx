import React, {useEffect, useState} from 'react';
import SStable from "src/common/components/table/SStable.jsx";
import {shallowEqual, useDispatch, useSelector} from "react-redux";

import {push} from "redux-first-history";

const DoorAllSearchTable = () => {


        const dispatch = useDispatch()

    const {
        searchResult
    } = useSelector(({doorReducer}) => ({
            searchResult: doorReducer.searchResult.data
        }),
        shallowEqual
    )


    useEffect(() => {
        if (searchResult) {
           setDataSource(searchResult?.searchResult)
        }

    }, [searchResult]);


    const [dataSource, setDataSource] = useState([])


const columns = [
        {
            title: '종류',
            dataIndex: 'boardNm',
        },
        {
            title: '카테고리',
            dataIndex: 'smallCateNm',
        },
            {
            title: '제목',
            dataIndex: 'contentNm',
        },
     {
            title: '상태',
            dataIndex: 'rentalStatNm',
        },
    ]

    return (


        // todo 로딩 처리
        <SStable
            useSearch={false}
            dataSource={dataSource}
            columns = {columns}
             onRowClick={(data) => {
                 dispatch(push(`/content/${data?.contentId}`))
             }}
        >

        </SStable>
    );
};

export default DoorAllSearchTable;
