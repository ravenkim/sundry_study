import { Children, cloneElement } from 'react'

// 위아래 구분하기 위해 만듬
const SSinnerWrapper = ({ children }) => {
    const hasTop = Children.toArray(children).some(
        (child) => child.type === SSinnerWrapper.Top,
    )
    const hasBottom = Children.toArray(children).some(
        (child) => child.type === SSinnerWrapper.Bottom,
    )

    if (!hasTop && !hasBottom) {
        return (
            <div className="flex flex-col w-full h-full items-center">
                <div className={'flex h-full flex-col w-[85%] justify-between'}>
                    <div className="flex-1">{children}</div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full h-full items-center">
            <div className={'flex h-full flex-col w-[85%] justify-between'}>
                {children}
            </div>
        </div>
    )
}

SSinnerWrapper.displayName = 'SSinnerWrapper'

// todo 여기서 80 퍼 props 로 선택 or 그기능 컴포넌트 따로 만들기
SSinnerWrapper.Top = ({ children }) => {
    return <div className="flex-1">{children}</div>
}

SSinnerWrapper.Top.displayName = 'SSinnerWrapper.Top'

SSinnerWrapper.Bottom = ({ children }) => {
    return <div className="h-auto w-full">{children}</div> // h-24는 약 100px에 해당합니다. 필요에 따라 조정하세요.
}

SSinnerWrapper.Bottom.displayName = 'SSinnerWrapper.Bottom'

export default SSinnerWrapper
