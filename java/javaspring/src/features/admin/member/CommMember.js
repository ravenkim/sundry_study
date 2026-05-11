import React, {useEffect, useState} from "react";
import {Modal, notification, Spin} from "antd";
import {useDispatch, useSelector} from "react-redux";

import FilterSelect from "./components/FilterSelect";
import MemberTable from "./components/MemberTable";
import MemberForm from "./components/MemberForm";
import {memberAction} from "features/admin/member/memberReducer";


const CommMember = () => {
    const dispatch = useDispatch();

    const {
        memberList,
        memberListError,
        memberDetail,
        memberDetailError,
        insertMemberState,
        insertMemberIpState,
        updateMemberState,
        autoMigrate,
        autoMigrateLoading,
        autoMigrateError,
    } = useSelector(
        ({memberReducer}) => ({
            memberList: memberReducer.memberList,
            memberDetail: memberReducer.memberDetail,
            insertMemberState: memberReducer.insertMemberState.data,
            insertMemberIpState: memberReducer.insertMemberIpState.data,
            updateMemberState: memberReducer.updateMemberState.data,
            autoMigrate: memberReducer.autoMigrate.data,
            autoMigrateLoading: memberReducer.autoMigrate.loading,
            autoMigrateError: memberReducer.autoMigrate.error
        })
    );
    useEffect(() => {
        dispatch(memberAction.getMemberList({target: "memberList"}));
    }, []);

    const openNotification = (type, msg, desc) => {
        notification[type]({
            message: msg,
            description: desc,
            placement: "bottomRight"
        })
    }

    const [selectedMemberKey, setSelectedMemberKey] = useState();

    const memberSelectHandler = (keys) => {
        setSelectedMemberKey(keys);
        dispatch(memberAction.getMember({target: "memberDetail", memberKey: keys}));
        setInsertVisible(false);
    };

    const [selectedFilter, setSelectedFilter] = useState("all");
    const selectedFilterHandler = (data) => {
        setSelectedFilter(data);
    };

    const [searchWord, setSearchWord] = useState();

    const searchHandler = (word) => {
        setSearchWord(word);
        if (selectedFilter && word) {
            dispatch(memberAction.getMemberList({target: "memberList", keyword: word, filterType: selectedFilter}));
        } else {
            dispatch(memberAction.getMemberList({target: "memberList"}));
        }
    }

    const [initialValues, setInitialValues] = useState();
    useEffect(() => {
        if (memberDetail.data) {
            setInitialValues(memberDetail.data);
        }
    }, [memberDetail.data]);
    const resetHandler = () => {
        dispatch(memberAction.getMemberList({target: "memberList"}));
        setSelectedFilter("all");
    };

    const [ipData, setIpData] = useState();

    const memberInsertHandler = (formData) => {
        Modal.confirm({
            title: '계정 추가',
            content: '위 계정을 추가하시겠습니까?',
            okText: '확인',
            cancelText: '취소',
            onOk: () => {
                dispatch(memberAction.insertMember(formData));
                setIpData(formData.ip);

            }
        })
    };
    const formDataFrame = {
        nd: '',
        ed: '',
        blngOrgnNm: '',
        memberTelNo: '',
        useYn: 'Y',
        groups: [],
        allGroups: [
            {
                "id": 1,
                "name": "ROLE_ADMIN",
                "desc": "관리자"
            },
            {
                "id": 2,
                "name": "ROLE_USER",
                "desc": "유저"
            },
            {
                "id": 3,
                "name": "ROLE_EXPERT",
                "desc": "간사"
            },
            {
                "id": 4,
                "name": "ROLE_DOWNLOAD",
                "desc": "문서열람"
            },
            {
                'id': 5,
                'name': 'ROLE_CHARGER',
                'desc': '담당자'
            }
        ],
        pd: '',
        confirmPwd: '',
        ip: [],
        ud: '',
    };

    const [insertVisible, setInsertVisible] = useState(false);

    const memberInsertButton = () => {
        setInitialValues(formDataFrame);
        setInsertVisible(true);
    };

    const memberDeleteHandler = (keys) => {
        Modal.confirm({
            title: "계정 삭제",
            content: "위 계정을 삭제하시겠습니까?",
            okText: "확인",
            cancelText: "취소",
            onOk: () => {
                dispatch(memberAction.deleteMember(keys));
                dispatch(memberAction.insertMemberIp({mbrId: keys, data: []}));
                setTask('삭제');
                setInitialValues();
            }
        })
    };

    const memberUpdateHandler = (formData) => {
        Modal.confirm({
            title: "계정 수정",
            content: "위 계정을 수정하시겠습니까?",
            okText: "확인",
            cancelText: "취소",
            onOk: () => {
                dispatch(memberAction.updateMember(formData));
                setIpData(formData.ip);
            }
        })

    };

    const filterList = [
        {
            value: "전체",
            key: "all"
        }, {
            value: "기관",
            key: "orgn"
        }, {
            value: "성명",
            key: "name"
        }, {
            value: "이메일",
            key: "email"
        }
    ];
    const [task, setTask] = useState();
    useEffect(() => {
        if (insertMemberState) {
            if (insertMemberState.state) {
                const memberId = insertMemberState.id;
                setTask('추가');
                setInsertVisible(false);
                dispatch(memberAction.insertMemberIp({mbrId: memberId, data: ipData}));
            } else {
                const errorMessage = Object.keys(insertMemberState.error).map((name) => insertMemberState.error[name][0])[0];
                openNotification('error', errorMessage);
            }
        }
    }, [insertMemberState]);

    useEffect(() => {
        if (updateMemberState) {
            if (updateMemberState.state) {
                const memberId = updateMemberState.id;
                setTask('수정');
                dispatch(memberAction.insertMemberIp({mbrId: memberId, data: ipData}));
            } else {
                const errorMessage = Object.keys(updateMemberState.error).map((name) => updateMemberState.error[name][0])[0];
                openNotification('error', errorMessage);
            }
        }
    }, [updateMemberState]);

    useEffect(() => {
        if (insertMemberIpState) {
            if (insertMemberIpState.state) {
                const memberKey = insertMemberIpState.id
                dispatch(memberAction.getMemberList({target: "memberList", key: searchWord}));
                if (task !== '삭제') {
                    dispatch(memberAction.getMember({memberKey: memberKey}))
                }
                openNotification('success', `${task}되었습니다.`);
            } else {
                openNotification('error', 'IP 검증에 실패하였습니다.');
            }
        }
    }, [insertMemberIpState]);


    /**
     * 회원정보 TIPA PMS 회원테이블과 동기화
     */
    const autoMigrateHandler = () => {
        Modal.confirm({
            title : "PMS 회원정보 동기화",
            content : "PMS 회원 정보와 해당 시스템 회원정보를 동기화합니다. 진행하시겠습니까?",
            okText : "확인",
            cancelText : "취소",
            onOk : (close) =>{
                dispatch(memberAction.memberAutoMigrate());
                close();
            }
        })
    }

    useEffect(() => {
        if (autoMigrate) {

            Modal.success({
                title: "동기화 완료",
                content: `동기화 완료하였습니다. 추가된 회원 : ${autoMigrate.add_count ? autoMigrate.add_count : 0}`,
                okText: "확인",
                onOk: (close) => {
                    dispatch(memberAction.initialize("autoMigrate"));
                    close();
                }
            })
            searchHandler(searchWord);
        }
    }, [autoMigrate]);


    useEffect(() => {
        if (autoMigrateError) {
            Modal.error({
                title: "동기화 실패",
                content: `TIPA 회원정보와 동기화에 실패하였습니다. 잠시 후 다시 시도해주세요`,
                okText: "확인",
                onOk: (close) => {
                    dispatch(memberAction.initialize("autoMigrate"));
                    close();
                }
            })
        }
    }, [autoMigrateError]);

    return (
        <>
            <main className="grid-col-full">
                <Spin spinning={autoMigrateLoading} tip={"PMS회원정보와 동기화 중입니다."}>
                    <div className="grid-col-2 gap-16 main-height-large relative">


                        <div className="grid-left">
                            {/*타이틀*/}
                            <FilterSelect
                                filterList={filterList}
                                selectedFilterHandler={selectedFilterHandler}
                                searchHandler={searchHandler}
                                resetHandler={resetHandler}
                                autoMigrateHandler={autoMigrateHandler}
                                memberInsertButton={memberInsertButton}
                            />
                            <MemberTable
                                memberData={memberList.data}
                                memberSelectHandler={memberSelectHandler}
                                resetHandler={resetHandler}
                                selectedMemberKey={selectedMemberKey}
                            />
                        </div>
                        {/*grid-left(레이아웃 왼쪽) end*/}

                        <div className="grid-right p-16">
                            {/*타이틀1*/}
                            <MemberForm
                                initialValues={initialValues}
                                memberInsertHandler={memberInsertHandler}
                                memberUpdateHandler={memberUpdateHandler}
                                memberDeleteHandler={memberDeleteHandler}
                                formDataFrame={formDataFrame}
                                insertVisible={insertVisible}
                            />
                        </div>
                        {/*  grid-right(레이아웃 오른쪽) end*/}
                    </div>
                </Spin>
            </main>
        </>
    );
};

export default CommMember;
