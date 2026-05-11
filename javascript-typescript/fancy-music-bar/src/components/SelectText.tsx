import useLocalStorage from '../hooks/useLocalStorage' // Adjust path if necessary
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react'

const SelectText = () => {
    const [text, setText] = useLocalStorage('displayText', 'Your text here')
    const [xOffset, setXOffset] = useLocalStorage('offsetX', 0)
    const [yOffset, setYOffset] = useLocalStorage('offsetY', 0)
    const [fontSize, setFontSize] = useLocalStorage('fontSize', 48) // Default font size
    const [lineHeight, setLineHeight] = useLocalStorage('lineHeight', 1.5) // Default line height
    const [textAlign, setTextAlign] = useLocalStorage('textAlign', 'center') // Default alignment

    return (
        <div className="z-50 flex flex-col gap-4 rounded-md bg-black/50 p-4">
            <label className="text-white flex flex-col gap-1">
                <span>Text:</span>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full rounded-md p-3 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                    rows={3}
                    placeholder="Enter your text here..."
                ></textarea>
            </label>
            <label className="text-white flex flex-col gap-1">
                <span>X Position Offset:</span>
                <div className="flex items-center">
                    <input
                        type="number"
                        value={xOffset}
                        onChange={(e) => setXOffset(Number(e.target.value))}
                        className="ml-2 w-24 rounded-md p-2 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="ml-2">px</span>
                </div>
            </label>
            <label className="text-white flex flex-col gap-1">
                <span>Y Position Offset:</span>
                <div className="flex items-center">
                    <input
                        type="number"
                        value={yOffset}
                        onChange={(e) => setYOffset(Number(e.target.value))}
                        className="ml-2 w-24 rounded-md p-2 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="ml-2">px</span>
                </div>
            </label>
            <label className="text-white flex flex-col gap-1">
                <span>Font Size:</span>
                <div className="flex items-center">
                    <input
                        type="number"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="ml-2 w-24 rounded-md p-2 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="ml-2">px</span>
                </div>
            </label>
            <label className="text-white flex flex-col gap-1">
                <span>Line Height:</span>
                <div className="flex items-center">
                    <input
                        type="number"
                        step="0.1"
                        value={lineHeight}
                        onChange={(e) => setLineHeight(Number(e.target.value))}
                        className="ml-2 w-24 rounded-md p-2 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </label>
            <label className="text-white">
                Text Align:
                <div className="ml-2 flex gap-2">
                    <button
                        onClick={() => setTextAlign('left')}
                        className={`rounded p-2 ${textAlign === 'left' ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
                    >
                        <AlignLeft size={20} />
                    </button>
                    <button
                        onClick={() => setTextAlign('center')}
                        className={`rounded p-2 ${textAlign === 'center' ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
                    >
                        <AlignCenter size={20} />
                    </button>
                    <button
                        onClick={() => setTextAlign('right')}
                        className={`rounded p-2 ${textAlign === 'right' ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
                    >
                        <AlignRight size={20} />
                    </button>
                </div>
            </label>
        </div>
    )
}

export default SelectText
