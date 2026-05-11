import React from "react";


/**
 * 라임콘텐츠버튼
 *  @param mainButtonSize 블록 버튼 단독 사용 시 block, 2개 버튼(eg. 확인, 취소) 사용 시 사이즈 조절 가능
 * */
const LimeContentButton = (
  {
    mainButtonSize="md",
    mainText,
    subText,
    mainButtonHandler,
    subButtonHandler,
    buttonDisabled
  }) => {
    return (
        <>
            { mainButtonSize !== "block" ?
                <button
                  type={"button"}
                  className={"btn btn-tertiary btn-sm"}
                  onClick={subButtonHandler}
                  disabled={buttonDisabled}
                >{subText}
                </button>
                :
                null
            }
            <button
              type={"submit"}
              className={`btn btn-primary btn-${mainButtonSize}`}
              onClick={mainButtonHandler}
              disabled={buttonDisabled}
            >{mainText}
            </button>
        </>
    )
}

export default LimeContentButton;