import React, {useEffect} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";

const UserInfo = () => {
    return(
        <>
            <div>
                <div>
                    <div>
                        <img src="" alt="#"/>
                        <button>프로필 이미지 변경</button>
                    </div>
                    <div>
                        <div>
                            <p>아이디</p>
                            <p>cksals123@gmail.com</p>
                        </div>
                        <div>
                            <p>비밀번호</p>
                            <button></button>
                            <input type="text"/>
                        </div>
                        <div>
                            <p>이름</p>
                            <p>박찬민</p>
                        </div>
                        <div>
                            <p>핸드폰 번호</p>
                            <p>010-9866-2951</p>
                        </div>
                    </div>
                </div>

                <div>
                    <button>취소</button>
                    <button>저장</button>
                </div>
            </div>
        </>
    )
}

export default UserInfo
