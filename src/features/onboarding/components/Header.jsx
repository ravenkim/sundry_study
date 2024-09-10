// 임시 헤더
import icon_out from 'src/assets/images/icon/Icon_out.svg'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate()

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                height: '48px',
                width: '100%',
                // border: '1px solid red',
            }}
        >
            <div
                style={{
                    width: '48px',
                    height: '48px',
                }}
            ></div>
            <div style={{ width: 'calc(100%)' }}></div>
            <div
                style={{
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                }}
            >
                <img
                    src={icon_out}
                    style={{ width: '18px' }}
                    onClick={() => navigate('/join')}
                />
            </div>
        </div>
    )
}

export default Header
