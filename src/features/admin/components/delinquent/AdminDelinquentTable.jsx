import React, {useEffect, useState} from 'react';

import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {adminAction} from "../../adminReducer.jsx";
import SStable from "../../../../common/components/table/SStable.jsx";
import {formatDate} from "../../../../common/utils/dataProcessingUtils.jsx";

const AdminDelinquentTable = () => {

    const dispatch = useDispatch()


    const {
        overdues

    } = useSelector(({adminReducer}) => ({
            overdues: adminReducer.overdues.data?.overdueContents
        }),
        shallowEqual
    )


    useEffect(() => {
        dispatch(adminAction.getOverdues())
    }, []);


    const [tableData, setTableData] = useState([])

    useEffect(() => {

        if (overdues) {
            setTableData(overdues.map((item) => {
                return {
                        ...item,
                    rentalDt: formatDate(item.rentalDt),
                    predReturnDt:formatDate(item.predReturnDt)

                }
            }))
            console.log(overdues)
        }

    }, [overdues]);


    const columns = [
        {
            title: '이름',
            dataIndex: 'userNm',

        },
        {
            title: '제목',
            dataIndex: 'contentNm',

        },
        {
            title: '대여일',
            dataIndex: 'rentalDt',

        },
        {
            title: '반납예정일',
            dataIndex: 'predReturnDt',

        },

        {
            title: '상태',
            // dataIndex: 'rentalDt',
            //     todo 변경필요


        },
        {
            title: '반납',
            dataIndex: 'rentalId',

        },
        {
            title: '연장',
            dataIndex: 'rentalId',

        },


    ]


    return (
        <SStable
            dataSource={tableData}
            columns={columns}
        ></SStable>
    );
};

export default AdminDelinquentTable;
