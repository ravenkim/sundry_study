import React, { useEffect, useState } from 'react'
import BaseWordCloud from 'features/chart/components/BaseWordCloud'

const LimeWordCloud = ({
    size=[600,400],
    clickHandler,
    dataSource
}) => {

    const [word, setWord] = useState([])
    const [originWord, setOriginWord] = useState(dataSource)

    const [minValue, setMinValue] = useState()
    const [maxValue, setMaxValue] = useState()

    useEffect(() => {
        if (dataSource && dataSource.length > 0) {
            let minValue = 2
            let maxValue = null
            let wordList = dataSource.map((item, index) => {
                let returnObj = {
                    text: item.term,
                    value: item.normDocFreqSum
                            ? item.normDocFreqSum
                            : item.norm_doc_freq_sum,
                    doc_ids: item.docIds ? item.docIds : item.doc_ids,
                }
                if (minValue) {
                    if (minValue > returnObj.value) {
                        minValue = returnObj.value
                    }
                } else {
                    minValue = returnObj.value
                }

                if (maxValue) {
                    if (maxValue < returnObj.value) {
                        maxValue = returnObj.value
                    }
                } else {
                    maxValue = returnObj.value
                }

                return returnObj
            })

            setMinValue(minValue)
            setMaxValue(maxValue)
            setWord(wordList)
        }
    }, [originWord])

    return (
            <><BaseWordCloud data={word} size={size} clickHandler={clickHandler}/></>
    )
}

export default LimeWordCloud
