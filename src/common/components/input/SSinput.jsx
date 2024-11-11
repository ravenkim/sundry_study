import { Input } from 'src/assets/shadcn/components/ui/input.jsx'
import { useCallback, useEffect, useId, useState } from 'react'
import debounce from 'lodash.debounce'

// todo import { z } from "zod" 추가해서 검증 로직 추가 할것

const SSinput = ({
    placeholder,
    value,
    onChange,
    description,
    label,
    className,
    type = 'text',
    onKeyDown,
}) => {
    //고유 id 생성
    const inputId = useId()

    // 입력 필드의 값
    const [inputValue, setInputValue] = useState(value)
    // 컴포넌트 밖에서 값이 바뀐 경우 처리
    useEffect(() => {
        setInputValue(value)
    }, [value])

    // 텍스트 길이 관리
    const [textLength, setTextLength] = useState(0)
    useEffect(() => {
        setTextLength(inputValue)
    }, [inputValue])

    //포커스 여부 관리
    const [isFocused, setIsFocused] = useState(false)
    const onFocus = () => {
        setIsFocused(true)
    }
    // 포커스에서 벗어나면 디바운스 처리 멈추고 바로 set
    const onBlur = () => {
        setIsFocused(false)
        debouncedOnChange.cancel()
        // onChange(inputValue)
        setInputValue(inputValue)
    }

    // onChange 디바운스 처리
    const debouncedOnChange = useCallback(
        debounce((value) => {
            // onChange(value)
            setInputValue(value)
        }, 300),
        [onChange],
    )

    useEffect(() => {
        if (isFocused) {
            debouncedOnChange(inputValue)
        }
    }, [inputValue, debouncedOnChange, isFocused])

    // 버튼 누르면 디바운스 멈추고 동작
    const handleKeyDown = (event) => {
        debouncedOnChange.cancel()
        // onChange(inputValue)
        setInputValue(inputValue)
        if (onKeyDown) {
            onKeyDown(event)
        }
    }

    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    return (
        <div className={`w-full`}>
            <label htmlFor={inputId}>{label}</label>
            <Input
                className={`h-[44px] border-muted ${className}`}
                id={inputId}
                type={type}
                value={inputValue}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
            />
            {isError ? <>{errorMessage}</> : <> {description}</>}
        </div>
    )
}

export default SSinput
