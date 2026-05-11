import MinsangEventGrid from 'src/features/minsang30/MinsangEventGrid.tsx'
import MinsangFooter from 'src/features/minsang30/MinsangFooter.tsx'
import MinsangHeader from 'src/features/minsang30/MinsangHeader.tsx'
import MinsangHero from 'src/features/minsang30/MinsangHero.tsx'
import MinsangRsvp from 'src/features/minsang30/MinsangRsvp.tsx'

const Home = () => {
    return (
        <div className="m30-landing bg-m30-surface text-m30-on-surface font-m30-body selection:bg-m30-primary-container selection:text-m30-on-primary min-h-[100dvh]">
            <main>
                <MinsangHero />
                <MinsangEventGrid />
                <MinsangRsvp />
                <MinsangFooter />
            </main>
        </div>
    )
}

export default Home
