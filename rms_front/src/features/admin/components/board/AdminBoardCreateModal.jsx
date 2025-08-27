import React from 'react';
import SSmodal from "src/common/components/modal/SSmodal.jsx";
import {Tabs} from "antd";
import AdminMember from "../member/AdminMember.jsx";
import AdminBoard from "./AdminBoard.jsx";
import SSinput from "../../../../common/components/input/SSinput.jsx";
import SSlabel from "../../../../common/components/label/SSlabel.jsx";


const AdminBoardCreateModal = ({
                                   modalVisible,
                                   setModalVisible
                               }) => {





    const onCancel = () => {
        //비지블 false
        setModalVisible(false)

        //데이터 초기화

    }


    const onOk = () => {

    }

    return (
        <SSmodal
            title={'보드 생성'}
            visible={modalVisible}
            onCancel={onCancel}
            onOk={onOk}
            okText={'Board 생성'}
            width={'1200px'}
            cancelText={'취소'}

        >
            <Tabs
                type="card"
                items={[
                    {
                        label: `기본정보`,
                        key: `member`,
                        children:
                            <div>
                                <SSlabel
                                    label={'이름'}
                                >
                                    <SSinput/>
                                </SSlabel>
                                <SSlabel
                                    label={'설명'}
                                >
                                    <SSinput/>
                                </SSlabel>


                            </div>,
                    },
                    {
                        label: `템플릿`,
                        key: `board`,
                        children: <div/>,
                    }

                ]}
            />


        </SSmodal>
    );
};

export default AdminBoardCreateModal;
