import React, {useEffect, useRef} from 'react';
import SSmodal from "src/common/components/modal/SSmodal.jsx";
import {Carousel} from 'antd';
import {CaretLeftOutlined, CaretRightOutlined, RightOutlined, RightSquareTwoTone} from "@ant-design/icons";


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

    useEffect(() => {

    }, []);


    // 슬라이드 좌우 이동 구형을 위한
    const carousel = useRef();

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
            <div
                style={{
                    width: '100%',
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: '700px',
                }}
            >
                <div
                    style={{
                        width: '10%',
                        fontSize: '100px',
                        display: "flex",
                        justifyContent: "center",
                        color: '#232433'
                    }}

                    onClick={() => carousel.current.prev()}
                >
                    <CaretLeftOutlined/>
                </div>

                <div
                    style={{
                        width: '80%',
                        height: '700px',
                    }}
                >
                    <Carousel
                        ref={carousel}
                    >
                        <div

                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: '700px',
                                    backgroundColor: "tomato",
                                    padding: '10px',
                                    border: 0
                                }}
                            >

                            </div>

                        </div>
                        <div>
                            <h3>2</h3>
                        </div>
                        <div>
                            <div
                                style={{
                                    width: '100%',
                                    height: '700px',
                                    backgroundColor: "tomato",
                                    padding: '10px'
                                }}
                            >

                            </div>
                        </div>
                        <div>
                            <h3>4</h3>
                        </div>
                    </Carousel>

                </div>


                <div
                    style={{
                        width: '10%',
                        fontSize: '100px',
                        display: "flex",
                        justifyContent: "center",
                        color: '#232433',

                    }}

                    onClick={() => carousel.current.next()}
                >

                    <CaretRightOutlined/>

                </div>

            </div>


        </SSmodal>
    );
};

export default AdminBoardCreateModal;
