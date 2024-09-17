import { Input } from 'src/assets/shadcn/components/ui/input.jsx'
import { useCallback, useEffect, useState } from 'react'
import debounce from 'lodash.debounce'

const SSinput = ({
    value,
    onChange,
    description = '',
    label,
    type = 'text',
}) => {
    const [inputValue, setInputValue] = useState(value)


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
        []
    )

    useEffect(() => {
        debouncedOnChange(inputValue)
        return () => {
            debouncedOnChange.cancel()
        }
    }, [inputValue, debouncedOnChange])

    return (
        <div>
            {label}
            <Input
                value={inputValue}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={(e) => setInputValue(e.target.value)}
            ></Input>
            {description}
        </div>
    )
}

export default SSinput
