import { Children, isValidElement } from 'react'


/**
 * @typedef {Object} Props
 * @property {React.ReactNode} children
 * @property {boolean} [bottom]
 */

/**
 * @type {React.FC<Props> & { Top: React.FC<{ children: React.ReactNode }>, Bottom: React.FC<{ children: React.ReactNode }> }}
 */
const SSinnerWrapper = ({ children }) => {
    const hasTop = Children.toArray(children).some(
        (child) => isValidElement(child) && child.type === SSinnerWrapper.Top,
    )
    const hasBottom = Children.toArray(children).some(
        (child) =>
            isValidElement(child) && child.type === SSinnerWrapper.Bottom,
    )

    if (!hasTop && !hasBottom) {
        return (
            <div className="flex h-full w-full flex-col items-center">
                <div className={'flex h-full w-[85%] flex-col justify-between'}>
                    <div className="flex-1">{children}</div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full w-full flex-col items-center">
            <div className={'flex h-full w-[85%] flex-col justify-between'}>
                {children}
            </div>
        </div>
    )
}

SSinnerWrapper.displayName = 'SSinnerWrapper'


/**
 * @type {React.FC<{ children: React.ReactNode }>}
 */
const Top = ({ children }) => <div className="flex-1">{children}</div>

Top.displayName = 'SSinnerWrapper.Top'
SSinnerWrapper.Top = Top


/**
 * @type {React.FC<{ children: React.ReactNode }>}
 */
const Bottom = ({ children }) => <div className="h-auto w-full">{children}</div>

Bottom.displayName = 'SSinnerWrapper.Bottom'
SSinnerWrapper.Bottom = Bottom

export default SSinnerWrapper