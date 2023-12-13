import React, {useState} from 'react';
import SSsearchInput from "/src/common/components/input/SSsearchInput.jsx";
import {Input} from "antd";
import SSsectionWrap from "/src/common/components/wrapper/SSsectionWrap.jsx";
import SScardWrap from "/src/common/components/Card/SScardWrap.jsx";
import SScard from "/src/common/components/Card/SScard.jsx";

const Door = () => {

    const [serchAllText, setSerchAllText] = useState()

    return (
        <>
            <SSsearchInput
                value ={serchAllText}
                onChange={(e) => setSerchAllText(e.target.value)}
                     placeholder={'찾고자 하는 항목을 입력하세요. (전체 항목에서 검색됩니다)'}
                title={'무엇을 찾으시나요?'}
            />
            <SSsectionWrap>
                <SScardWrap>
                    <SScard>
                        <div>
                            adfasdfasdf
                        </div>
                    </SScard>
                    <SScard>
                        <div>
                            adfasdfasdf
                        </div>
                    </SScard>
                    <SScard>
                        <div>
                            adfasdfasdf
                        </div>
                    </SScard>
                    <SScard>
                        <div>
                            adfasdfasdf
                        </div>
                    </SScard>
                    <SScard>
                        <div>
                            adfasdfasdf
                        </div>
                    </SScard>
                </SScardWrap>
            </SSsectionWrap>
        </>
    );
};

export default Door;

