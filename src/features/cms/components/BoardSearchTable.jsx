import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import SStable from "../../../common/components/table/SStable.jsx";
import {push} from "redux-first-history";
import {cmsAction} from "../cmsReducer.jsx";

const BoardSearchTable = ({path}) => {

    const dispatch = useDispatch()
    const [searchData, setSearchData] = useState([])

    const {
        searchResult,
    } = useSelector(({cmsReducer, router}) => ({
            searchResult: cmsReducer.boardSearchResult.data,
        }),
        shallowEqual
    )

    useEffect(() => {
        if (searchResult) {
            setSearchData(searchResult?.searchResult)
        }

    }, [searchResult]);

    useEffect(() => {
        return () => {
            dispatch(cmsAction.initializeAll())
            // 페이지 나가면 초기화
        }
    }, []);


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
        <>
            <SStable
                useSearch={false}
                dataSource={searchData}
                columns={columns}
                onRowClick={(data) => {
                    dispatch(push(`/content/${data?.contentId}`))
                }}
            >

            </SStable>
        </>
    )
}

export default BoardSearchTable
