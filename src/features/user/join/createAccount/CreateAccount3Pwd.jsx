import { useEffect, useState } from 'react'

const CreateAccount3Pwd = () => {
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')


    useEffect(() => {
        if(password1.length > 0 && password2.length > 0) {
            if(password1 === password2) {
                // 다음 활성화


            } else {
            //     페스워드가 다릅니다


            }
        }

    }, [password1, password2])

    return (
        <div>


            
        </div>
    )
}

export default CreateAccount3Pwd