import BlurText from 'src/shared/components/text/SSblurAniText.tsx'
import SSdarkmodeSwitch from 'src/shared/components/theme/SSdarkmodeSwitch.tsx'
import SScolorDrawer from 'src/shared/components/theme/SScolorDrawer.tsx'

const WhHeader = ({ title }: { title: string }) => {
    return (
        <header className="flex items-center justify-between border-b border-solid px-10 py-4 whitespace-nowrap">
            <div className="flex items-center gap-8">
                <BlurText
                    text={title}
                    delay={150}
                    animateBy="words"
                    direction="top"
                    // onAnimationComplete={}
                    className="text-2xl"
                />
            </div>
            <div className="flex items-center gap-2">
                <SSdarkmodeSwitch />
                <SScolorDrawer />
            </div>
        </header>
    )
}

export default WhHeader
