import {InboxOutlined} from '@ant-design/icons';
import {message, Upload, Space, Divider, Button, Spin, Input} from 'antd';
import {useNavigate} from "react-router-dom";
import React, {useState} from 'react';

const HomePage = () => {

     const navigate = useNavigate();
    const {Dragger} = Upload;
    const props = {
        name: 'file',
        multiple: true,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        onChange(info) {
            const {status} = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const [loading, setLoading] = useState(false);

    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                backgroundColor: '#333333',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",

            }}
        >





            <Space
                direction={"vertical"}
            ><h2
                style={{
                    fontSize: '20px',
                    color: "#eeeeee",

                }}
            >
                Picture Finder
            </h2>
                <h1
                    style={{
                        fontSize: '50px',
                        color: "white",

                    }}
                >
                    PF에 오신것을 환영합니다.

                </h1>
                <h2
                style={{
                    fontSize: '20px',
                    color: "#eeeeee",

                }}
            >
                당신을 위한 사진 검색 어플리케이션
            </h2>







                <Divider
                    style={{
                              backgroundColor: '#fff6bd'
                          }}>
                </Divider>


                <Spin
                    spinning={loading}
                >
                  <div
                        style={{
                            display: "flex",
                            flexDirection: "row"
                        }}
                    >

                        <Input
                            style={{
                                width: 500,
                                marginTop: 15,
                                marginRight: 10,
                            height: 40
                        }}
                        ></Input>




                        <Button
                            onClick={() => {
                                setLoading(true)
                                setTimeout(() => {
                                    navigate('/pic');
                                }, 8500);
                            }}
                            style={{
                                marginTop: 15
                            }}
                        >
                            제출하기


                        </Button>

                    </div>



                <Divider
                    style={{
                              backgroundColor: '#fff6bd'
                          }}>
                </Divider>

<Dragger  {...props}

                                style={{
                                    backgroundColor: '#fff6bd'
                                }}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined/>
                    </p>
                    <p className="ant-upload-text">파일을 업로드할려면 클릭하거나 드래그 하세요</p>


                </Dragger>

                
                </Spin>
     </Space>
        </div>
    );
};

export default HomePage;
