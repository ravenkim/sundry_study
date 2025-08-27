import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {cmsAction} from "../../cms/cmsReducer.jsx";
import SScard from "../../../common/components/card/SScard.jsx";
import img_profile_url from "../../../assets/img/profile.svg";
import img_manager_url from "../../../assets/img/manager.svg";
import {push} from "redux-first-history"


const DoorContentsCard = () => {

    const dispatch = useDispatch()

    const {
        boardType,
        user,

    } = useSelector(({userReducer, cmsReducer}) => ({
            boardType: cmsReducer.boardList.data,
            user: userReducer.user,
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(cmsAction.getBoardList())

        return () => {
            dispatch(cmsAction.initializeAll())
        }
    }, []);


    return (
        <>
            {/*보드리스트 카드*/}
            {boardType?.boardList?.map((boardList, idx) => (
                    <SScard
                        key={idx}
                        className={'cursor-pointer min-w-[23.5%] max-w-[23.5%]'}
                        onClick={() => {
                            dispatch(push(`/board/${boardList?.boardId}`))
                        }}
                        title={boardList?.boardNm}
                    >
                    </SScard>
                    /*<div className={'p-[20px] box-border flex flex-col justify-between w-full'}>
                        <h3 className={'text-[20px] font-[NotoSansKR-700]'}>
                            {boardList?.boardNm}
                        </h3>
                    </div>*/
                )
            )}

            {/*사용자 프로필로 이동 카드*/
            }
            <SScard
                onClick={() => {
                    dispatch(push('/profile'))
                }}
                className={
                    'cursor-pointer min-w-[23.5%] max-w-[23.5%] '
                }
                title={'프로필'}
                image={img_profile_url}
            >
            </SScard>

            {/*관리자 권한 카드*/}
            {user?.priority <= 4 &&
                <SScard
                    onClick={() => {
                        dispatch(push('/admin'))
                    }}
                    className={
                        'cursor-pointer min-w-[23.5%] max-w-[23.5%] block'
                    }
                    title={'관리자'}
                    image={img_manager_url}
                >
                </SScard>
            }


        </>
    )
}

export default DoorContentsCard
