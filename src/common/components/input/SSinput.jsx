import { Input } from 'src/assets/shadcn/components/ui/input.jsx'
import { useCallback, useEffect, useId, useState } from 'react'
import debounce from 'lodash.debounce'

const SSinput = ({
    value,
    onChange,
    description ,
    label,
    type = 'text',
}) => {
    const inputId = useId()

    const [inputValue, setInputValue] = useState(value)

    //todo type 이 num 일떄 동작하기 위해 추가 필요
    const [textLength, setTextLength] = useState(0)
    useEffect(() => {
        setTextLength(inputValue)
    }, [inputValue])

    // 포커스 잊었는지 처리
    const [isFocused, setIsFocused] = useState(false)
    const onFocus = () => {
        setIsFocused(true)
    }
    const onBlur = () => {
        setIsFocused(false)
    }

    // onChange 디바운스 처리
    const debouncedOnChange = useCallback(
        debounce((value) => {
            onChange(value)
        }, 300),
        [],
    )

    useEffect(() => {
        debouncedOnChange(inputValue)
        return () => {
            debouncedOnChange.cancel()
        }
    }, [inputValue, debouncedOnChange])

    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    return (
        <div>
            <label htmlFor={inputId}>{label}</label>
            <Input
                id={inputId}
                type={'text'}
                value={inputValue}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={(e) => setInputValue(e.target.value)}
            ></Input>
            {isError ? <>{errorMessage}</> : <> {description}</>}
        </div>
    )
}

export default SSinput
