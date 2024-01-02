import React, {useEffect, useState} from 'react';
import SStable from "../../../common/components/table/SStable.jsx";
import {shallowEqual, useSelector} from "react-redux";
import SSbutton from "../../../common/components/button/SSbutton.jsx";
import {adminAction} from "../../admin/adminReducer.jsx";

const DoorAllSearchTable = () => {

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
        <SStable
            useSearch={false}
            dataSource={dataSource}
            columns = {columns}
        >

        </SStable>
    );
};

export default DoorAllSearchTable;
