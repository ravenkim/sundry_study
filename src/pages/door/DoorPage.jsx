import React from 'react';
import SSlayout from "../../common/components/layout/SSlayout.jsx";
import {Input} from "antd";

const DoorPage = () => {




    return (
        <SSlayout>
            <div
                style={{
                    width: '800px'
                }}
            >
                무엇을 찾으시나요?
                <Input

                />
            </div>

            <div
                style={{
                    width: '800px'
                }}
            >
                원하는 서비스로 가장 빠르게 이동해 보세요.

            </div>
        </SSlayout>
    );
};

export default DoorPage;
