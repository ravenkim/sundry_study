import React, { useState } from 'react'

const Tt = () => {
    const [a1, setA1] = useState('')
    const [a2, setA2] = useState('')
    const [a3, setA3] = useState('')
    const [a4, setA4] = useState('')
    const [a5, setA5] = useState('')
    const [a6, setA6] = useState('')
    const [a7, setA7] = useState('')
    const [a8, setA8] = useState('')
    const [a9, setA9] = useState('')
    const [a10, setA10] = useState('')
    const [a11, setA11] = useState('')
    const [a12, setA12] = useState('')
    const [a13, setA13] = useState('')
    const [a14, setA14] = useState('')
    const [a15, setA15] = useState('')
    const [a16, setA16] = useState('')

    const inputs = []
    for (let i = 0; i < 100000; i++) {
        inputs.push(
            <input
                key={i}
                value={a1}
                onChange={(e) => setA1(e.target.value)}
            />,
        )
    }

    return (
        <div>
            {inputs}

            <input value={a1} onChange={(e) => setA1(e.target.value)} />
            <input value={a2} onChange={(e) => setA2(e.target.value)} />
            <input value={a3} onChange={(e) => setA3(e.target.value)} />
            <input value={a4} onChange={(e) => setA4(e.target.value)} />
            <input value={a5} onChange={(e) => setA5(e.target.value)} />
            <input value={a6} onChange={(e) => setA6(e.target.value)} />
            <input value={a7} onChange={(e) => setA7(e.target.value)} />
            <input value={a8} onChange={(e) => setA8(e.target.value)} />
            <input value={a9} onChange={(e) => setA9(e.target.value)} />
            <input value={a10} onChange={(e) => setA10(e.target.value)} />
            <input value={a11} onChange={(e) => setA11(e.target.value)} />
            <input value={a12} onChange={(e) => setA12(e.target.value)} />
            <input value={a13} onChange={(e) => setA13(e.target.value)} />
            <input value={a14} onChange={(e) => setA14(e.target.value)} />
            <input value={a15} onChange={(e) => setA15(e.target.value)} />
            <input value={a16} onChange={(e) => setA16(e.target.value)} />
        </div>
    )
}

export default Tt
