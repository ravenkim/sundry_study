import { Textarea } from 'src/assets/shadcn/components/ui/textarea.jsx'
import { useId, useState } from 'react'

const SStextarea = ({ placeholder, label, description, className }) => {
    const inputId = useId()

    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const terms = [
        {

            //todo 디비에 번호랑 약관 형식 추가

            title: '팅 이용약관',
            isRequired: false,
            article: [
                {
                    articleTitle: 'aa',
                    articleText: 'aa',
                },
                {
                    articleTitle: 'aa',
                    articleText: 'aa',
                },
                {
                    articleText: '이어지는 단락',
                },
            ],
        },
    ]

    return (
        <div>
            <label htmlFor={inputId}>{label}</label>

            {/*todo 위에 있는 형태를 전환해서 보여주고 처리 필요 */}

            {isError ? <>{errorMessage}</> : <> {description}</>}
        </div>
    )
}

export default SStextarea
