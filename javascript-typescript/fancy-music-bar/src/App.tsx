import FloatingButtons from './components/FloatingButtons'
import './App.css'
import useLocalStorage from './hooks/useLocalStorage.ts'
import { BACKGROUNDS } from './constants/backgrounds.tsx'
import DisplayText from './components/DisplayText' // Import DisplayText

function App() {
    const [bg, setBg] = useLocalStorage('bg', 'prism')

    const ActiveBackground =
        BACKGROUNDS.find((b) => b.id === bg)?.component || null

    // Removed text-related state and effects as they are now in DisplayText

    return (
        <div className="h-screen w-screen bg-gray-900">
            <div className={'h-full w-full'}>{ActiveBackground}</div>
            <FloatingButtons setBg={setBg} />

            {/* Render the DisplayText component */}
            <DisplayText />
        </div>
    )
}

export default App
