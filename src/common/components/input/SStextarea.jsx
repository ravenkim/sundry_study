import { Textarea } from 'src/assets/shadcn/components/ui/textarea.jsx'
import { useId, useState } from 'react'

const SStextarea = ({ placeholder, label, description, className }) => {
    const inputId = useId()

    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')


    return (
        <div>
            <label htmlFor={inputId}>{label}</label>
            <Textarea placeholder={placeholder} className={`resize-none ${className}`} />

            {isError ? <>{errorMessage}</> : <> {description}</>}
        </div>
    )
}

export default SStextarea
