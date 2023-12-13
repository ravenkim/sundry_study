import MainLogo from '/src/assets/logo/logo_main.png'

const MainLogoSvg = ({
    width
                     }) => {
    return (
        <div>
            <img src={MainLogo} alt="#" width={width} />
        </div>
    )
}

export default MainLogoSvg
