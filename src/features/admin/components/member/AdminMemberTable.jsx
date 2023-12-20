import React, {useEffect, useState} from 'react';
import SStable from "../../../../common/components/table/SStable.jsx";
import {removeRole} from "../../../../common/utils/redux/dataProcessingUtils.jsx";

const AdminMemberTable = () => {


    const tempData = [
        {
            "userNm": "김민교",
            "userEmail": "test1@euclidsoft.co.kr",
            "joinDt": "2023.12.12",
            "authNm": "ROLE_슈퍼_관리자",
            "userStat": "CD006001"
        },
        {
            "userNm": "김효진",
            "userEmail": "test2@euclidsoft.co.kr",
            "joinDt": "2023.12.12",
            "authNm": "ROLE_시스템_관리자",
            "userStat": "CD006001"
        },
        {
            "userNm": "박찬민",
            "userEmail": "test3@euclidsoft.co.kr",
            "joinDt": "2023.12.12",
            "authNm": "ROLE_슈퍼_게시판_관리자",
            "userStat": "CD006001"
        },
        {
            "userNm": "김해준",
            "userEmail": "test4@euclidsoft.co.kr",
            "joinDt": "2023.12.12",
            "authNm": "ROLE_개별_게시판_관리자",
            "userStat": "CD006001"
        },
        {
            "userNm": "박소현",
            "userEmail": "test5@euclidsoft.co.kr",
            "joinDt": "2023.12.12",
            "authNm": "ROLE_임원급_회원",
            "userStat": "CD006001"
        },
        {
            "userNm": "김소현",
            "userEmail": "test6@euclidsoft.co.kr",
            "joinDt": "2023.12.12",
            "authNm": "ROLE_일반_회원",
            "userStat": "CD006001"
        },
        {
            "userNm": "최연준",
            "userEmail": "test7@euclidsoft.co.kr",
            "joinDt": "2023.12.12",
            "authNm": "ROLE_손님",
            "userStat": "CD006001"
        },
        {
            "userNm": "최수빈",
            "userEmail": "test8@euclidsoft.co.kr",
            "joinDt": "2023.12.12",
            "authNm": "ROLE_손님",
            "userStat": "CD006001"
        },
        {
            "userNm": "최범규",
            "userEmail": "test9@euclidsoft.co.kr",
            "joinDt": "2023.12.12",
            "authNm": "ROLE_손님",
            "userStat": "CD006001"
        },
        {
            "userNm": "강태현",
            "userEmail": "test10@euclidsoft.co.kr",
            "joinDt": "2023.12.12",
            "authNm": "ROLE_손님",
            "userStat": "CD006001"
        },
        {
            "userNm": "휴닝카이",
            "userEmail": "test11@euclidsoft.co.kr",
            "joinDt": "2023.12.12",
            "authNm": "ROLE_손님",
            "userStat": "CD006001"
        },
        {
            "userNm": "김민교",
            "userEmail": "test99@euclidsoft.co.kr",
            "joinDt": "2023.12.14",
            "authNm": "ROLE_손님",
            "userStat": "CD006001"
        }
    ]

    const columns = [
        {
            title: '이름',
            dataIndex: 'userNm',
        },
        {
            title: '이메일',
            dataIndex: 'userEmail',
        },
        {
            title: '가입일',
            dataIndex: 'joinDt',
        },
        {
            title: '권한',
            dataIndex: 'authNm',
        },
        {
            title: '상태',
            dataIndex: 'userStat',
        }
    ]




    const [finnalTableData, setFinnalTableData] = useState([])


    useEffect(() => {
        if (tempData) {
            setFinnalTableData(removeRole(tempData))
        }
    }, [tempData]);


    return (
        <SStable
            columns={columns}
            dataSource={finnalTableData}
        >

        </SStable>
    );
};

export default AdminMemberTable;
