import React, {useState} from 'react';
import {Avatar, List, Input} from 'antd';
// import moment from 'moment';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {formatDate} from "src/common/utils/dataProcessingUtils.jsx";
import SSbutton from "/src/common/components/button/SSbutton.jsx";
import comment_icon from 'src/assets/img/icon_comment.svg'
import {cmsAction} from "src/features/cms/cmsReducer.jsx";

const {TextArea} = Input;

/**
 * 댓글 리스트 전체 컴포넌트
 * isParent 가 true면 댓 false면 대댓
 */
const CommentList = ({comments, isParent}) => {

    const {
        userId,
    } = useSelector(({userReducer}) => ({
        userId: userReducer.user.userId,
    }))

    const [replyingTo, setReplyingTo] = useState('');

    return (
        <List
            dataSource={comments}
            pagination={isParent ? {pageSize: 5, size: "small"} : false}
            itemLayout="vertical"
            size={"small"}
            split={false}
            renderItem={(item, index) => (
                <>
                    <List.Item className={`${isParent ? "pt-[16px] pb-[12px] px-0" : "px-[10px] py-[8px]"}`}
                               key={item.commentId}>
                        {/* 픽셀을 맞추려면 안트디 기본 제공 Meta를 쓰지 못함 */}
                        {/* <List.Item.Meta
                        avatar={<Avatar src={item.avatar} size={40}/>}
                        title={<div className="text-sm mb-0 pb-0">{item.author}</div>}
                        description={<div className="text-xs mt-0 pt-0">{item.regDt}</div>}
                        />  */}

                        <SingleComment {...item} userId={userId} isParent={isParent} replyingTo={replyingTo}
                                       setReplyingTo={setReplyingTo}/>

                    </List.Item>
                    {/* 댓글간 구분선 유무 */}
                    {(((isParent && item.children.length === 0) || (!isParent && index !== comments.length - 1)) && (replyingTo !== item.commentId)) &&
                        <div className='border-b-[1px] border-solid border-[#ECEDF0]'/>}

                    {/* 대댓 렌더링 */}
                    {(item.children.length > 0 || replyingTo === item.commentId) &&
                        <>
                            <div
                                className="ml-[15px] rounded-[5px] border-[1px] border-solid border-t border-[#ECEDF0] bg-[#F5F5F5]/80">
                                {item.children.length > 0 &&
                                    <>
                                        <CommentList comments={item.children} userId={userId} isParent={false}/>

                                        {/* 하단에 대댓 입력창 생성시 구분선 표시 */}
                                        {replyingTo === item.commentId &&
                                            <div className='border-b-[1px] border-solid border-[#ECEDF0] mx-[10px]'/>}
                                    </>
                                }

                                {/* 댓글달기 클릭시 입력창 생성 */}
                                {replyingTo === item.commentId &&
                                    <>
                                        <div className='px-[19px] py-[14px]'>
                                            <CommentEditor replyingTo={replyingTo} setReplyingTo={setReplyingTo}/>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className='border-b-[1px] border-solid border-[#ECEDF0] mt-[16px]'/>
                        </>
                    }
                </>
            )}
        />
    )
}

const CommentEditor = ({
                           replyingTo,
                           setReplyingTo,
                           commentId,
                           commentContent = '',
                           isEditMode = false,
                           setIsEditMode
                       }) => {

    const dispatch = useDispatch()

    const {
        contentId,
    } = useSelector(({cmsReducer}) => ({
            contentId: cmsReducer.contentDetail.data.contentDtl.contentId
        }),
        shallowEqual
    )

    const [comment, setComment] = useState(commentContent);

    const addComment = () => {
        // score 기능은 아직 없으므로 기본값 0으로 넘김
        const commentData = {contentId: contentId, comment: comment.trim().replace(/\n/g, "<br>"), score: 0}
        if (replyingTo) {
            commentData.parentCommentId = replyingTo;
        }
        dispatch(cmsAction.saveComment(commentData));
        setComment('')
    }

    const modifyComment = () => {
        dispatch(cmsAction.modifyComment({
            contentId: contentId,
            commentId: commentId,
            comment: comment.trim().replace(/\n/g, "<br>"),
            score: 0
        }))
    }

    return (
        <>
            <div
                className="container rounded-[5px] border-solid border-[#ACACBA] border-[1px] bg-white overflow-hidden p-0">
                <textarea
                    className="w-full resize-none border-0 h-[88px] px-[16px] py-[12px] focus:outline-none block box-border placeholder-[#ACACBA] text-[#232433] text-[16px] font-[NotoSansKR-500]"
                    value={comment.replace(/<br>/g, "\n")} onChange={(e) => setComment(e.target.value)}
                    placeholder="댓글을 입력하세요.">
                </textarea>

                {/* 댓글 구분선 */}
                <div className='border-b-[1px] border-solid border-[#ECEDF0]'/>

                <div className="flex justify-end space-x-[6px] pr-[8px] py-[8px]">
                    <SSbutton
                        className="flex items-center justify-center text-[#51525C] bg-[#e3e4e8] border-0 rounded-[5px] hover:bg-gray-300 w-[68px] h-[34px] px-[19px] py-[9px]"
                        style={{boxShadow: 'none'}}
                        onClick={() => {
                            // 구댓글 수정창인지 새댓글 입력창인지에 따른 기능 구분
                            if (isEditMode) {
                                setIsEditMode(false);
                            } else {
                                setComment('');
                                if (replyingTo !== '') {
                                    setReplyingTo('');
                                }
                            }
                        }}>
                        <span className="text-center text-[16px] font-[NotoSansKR-500] leading-[16px]">취소</span>
                    </SSbutton>
                    <SSbutton
                        className="flex items-center justify-center text-[#FFFFFF] bg-[#4f5ff5] border-0 rounded-[5px] hover:bg-[#263BF2] w-[68px] h-[34px] px-[19px] py-[9px]"
                        style={{boxShadow: 'none'}}
                        onClick={() => {
                            comment.trim() !== '' && (isEditMode ? (modifyComment(), setIsEditMode(false)) : addComment());
                        }}>
                        <span className="text-center text-[16px] font-[NotoSansKR-500] leading-[16px]">등록</span>
                    </SSbutton>
                </div>
            </div>
        </>
    )
}


const SingleComment = ({
                           commentId,
                           parentCommentId,
                           authorId,
                           authorNm,
                           profileImg,
                           commentContent,
                           modfDt,
                           delYn,
                           children,
                           userId,
                           isParent,
                           replyingTo,
                           setReplyingTo,
                       }) => {

    const dispatch = useDispatch()

    const {
        contentId,
    } = useSelector(({cmsReducer}) => ({
            contentId: cmsReducer.contentDetail.data.contentDtl.contentId
        }),
        shallowEqual
    )

    const [isEditMode, setIsEditMode] = useState(false)

    const deleteComment = () => {
        dispatch(cmsAction.deleteComment({contentId: contentId, commentId: commentId}))
    }

    return (
        <div className={`flex-1 ${isParent ? "space-y-[17px]" : "space-y-[16px]"}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    <Avatar
                        className="rounded-full w-10 h-10"
                        src={profileImg}
                        alt=""/>
                </div>
                <div className="flex-1 my-[2px] ml-[14px] leading-tight space-y-[5px] font-[NotoSansKR-400]">
                    <p className='h-[16px] text-[12px] text-[#232433]'>{authorNm}</p>
                    <p className='h-[16px] text-[10px] text-[#ACACBA]'>{formatDate(modfDt)}</p>
                </div>
            </div>

            {/* 수정시 입력창으로 전환 */}
            {isEditMode ? (
                <CommentEditor commentId={commentId} commentContent={commentContent} isEditMode={isEditMode}
                               setIsEditMode={setIsEditMode}/>
            ) : (
                <>
                    {delYn === 'Y' ?
                        <p className='text-[16px] leading-[16px] text-[#ACACBA] font-[NotoSansKR-350]'>[삭제된
                            댓글]</p> :
                        <p className='text-[16px] leading-[16px] text-[#232433] font-[NotoSansKR-350] whitespace-pre-wrap'>
                            {commentContent.replace(/<br>/g, "\n")}
                        </p>
                    }

                    <div className='flex items-center justify-between h-[24px]'>
                        {/* 최상위 댓글인 경우에만 댓글달기 버튼 표시 */}
                        {isParent ? (
                            <div
                                className="flex items-center text-[#4f5ff5] font-[NotoSansKR-400] text-[12px] cursor-pointer"
                                onClick={() => {
                                    replyingTo === commentId ? setReplyingTo('') : setReplyingTo(commentId)
                                }}>
                                <img src={comment_icon} className="ml-[5px] mr-[6px]"/>
                                댓글달기
                            </div>
                        ) : (
                            <div></div>
                        )}

                        {/* 로그인한 사용자가 작성한 댓글일 경우 수정, 삭제 버튼 표시 */}
                        {userId === authorId && delYn === 'N' && (
                            <div className="flex items-center space-x-[4px]">
                                <SSbutton
                                    className='flex items-center justify-center w-[63px] h-[24px] px-[20px] py-[4px] bg-[#E3E4E8] hover:bg-gray-300 rounded-[5px] border-0'
                                    style={{boxShadow: 'none'}}
                                    onClick={() => setIsEditMode(true)}>
                                        <span
                                            className="text-center text-[12px] text-[#51525C] font-[NotoSansKR-500] leading-[16px]">수정</span>
                                </SSbutton>
                                <SSbutton
                                    className='flex items-center justify-center w-[63px] h-[24px] px-[20px] py-[4px] bg-[#E3E4E8] hover:bg-gray-300 rounded-[5px] border-0'
                                    style={{boxShadow: 'none'}}
                                    onClick={deleteComment}>
                                        <span
                                            className="text-center text-[12px] text-[#51525C] font-[NotoSansKR-500] leading-[16px]">삭제</span>
                                </SSbutton>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}


const CommentContainer = ({
                              comments
                          }) => {

    return (
        <div>
            <p className='text-[14px] text-[#232433] font-[NotoSansKR-400] leading-[16px] mb-[6px]'>{comments.length}개의
                댓글</p>
            <CommentEditor/>
            {comments.length > 0 &&
                <CommentList comments={comments} isParent={true}/>
            }
        </div>
    );
};

export default CommentContainer;
