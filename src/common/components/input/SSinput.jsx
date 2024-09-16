import { Input } from 'src/assets/shadcn/components/ui/input.jsx'
import STlabel from 'src/common/components/typography/STlabel.jsx'

const SSinput = ({onChange = () => {}, value='', placeholder, error = false , disabled = false, success= false}) => {
    //todo

    // 포커스시 처리
    // 호버시 처리
    // 애러 핸들 함수
    // 애러 처리 과정
    // 디자인 맞게
    // 값입력받기
    // 값처리 방법
    // 디바운스 처리






    return (
        <div>
            <Input


                placeholder={placeholder} className={``}></Input>
            <STlabel></STlabel>
        </div>
    )
}

export default SSinput
