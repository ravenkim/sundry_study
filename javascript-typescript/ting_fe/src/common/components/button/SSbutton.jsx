import { Button } from 'src/assets/shadcn/components/ui/button.jsx'
import STh4 from 'src/common/components/typography/STh4.jsx'

/**
 * @typedef {'default' | 'destructive' | 'outline' | 'ghost'} Variant
 */

/**
 * SSbutton 컴포넌트
 *
 * @param {Object} props - 컴포넌트의 속성
 * @param {string} props.text - 버튼에 표시될 텍스트
 * @param {string} [props.size='block'] - 버튼의 크기
 * @param {Object} [props.style={}] - 스타일 객체
 * @param {Function} props.onClick - 클릭 이벤트 핸들러
 * @param {string} [props.variant='default'] - 버튼의 다양성 옵션
 * @param {string} [props.className] - 추가적인 클래스 이름
 * @param {...Object} props.props - 나머지 props
 */

const SSbutton = ({
    text,
    size = 'block',
    style = {},
    onClick,
    variant,
    className,
    ...props
}) => {
    return (
        <Button
            className={`mb-[12px] ${className}`}
            onClick={onClick}
            size={size}
            variant={variant}
            {...props}
        >
            <STh4>{text}</STh4>
        </Button>
    )
}

export default SSbutton
