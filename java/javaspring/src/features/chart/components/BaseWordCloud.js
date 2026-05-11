import React, {useEffect, useMemo, useState} from 'react'
import * as d3 from 'd3'
import {max, min, range} from 'd3-array'
import cloud from 'd3-cloud'
import seedrandom from 'seedrandom'
import {scaleLinear, scaleLog, scaleOrdinal, scaleSqrt} from 'd3-scale'

const BaseWordCloud = ({
                           data,
                           id = 'my_word_cloud',
                           logHandler = () => {
                           },
                           options,
                           clickHandler,
                           size = [600, 400]
                       }) => {

    const [option, setOptions] = useState(options ? options : {
        colors: '#121A4D',
        fontFamily: 'impact',
        fontSizes: [20, 60],
        fontStyle: 'normal',
        fontWeight: 'bold',
        rotations: 3,
        rotationAngles: [0],
        transitionDuration: 1000,
        deterministic: true,
        enableTooltip: true,
        scale: 'sqrt',
        spiral: 'archimedean',
        padding: 1,
    })
    const getFontSize = (word) => {
        return `${word.size}px`
    }
    const getWordColor = (word) => {
        if (word.value >= 3 && word.value < 6) {
            return '#535C99'
        } else if (word.value >= 6 && word.value < 9) {
            return '#373D66'
        } else if (word.value >= 9 && word.value < 12) {
            return '#121A4D'
        } else if (word.value >= 12) {
            return '#121A4D'
        } else {
            return '#8F92AA'
        }
    }
    const getFontScale = (words, fontSizes, scale) => {
        const minSize = min(words, word => (word.value))
        const maxSize = max(words, word => (word.value))
        let scaleFunction
        switch (scale) {
            case 'log':
                scaleFunction = scaleLog
                break
            case 'sqrt':
                scaleFunction = scaleSqrt
                break
            case 'linear':
            default:
                scaleFunction = scaleLinear
                break
        }
        const fontScale = scaleFunction()
            .domain([minSize, maxSize])
            .range(fontSizes)
        return fontScale
    }

    useEffect(() => {
        if (data) {
            d3.select(`#${id}`).select('g').remove()
            const sortedWords = data
                .concat()
                // .sort((x, y) => d3.descending(x.value, y.value))
                .slice(0, 100)
            const random = seedrandom('deterministic')
            let width = size[0],
                height = size[1]
            let svg = d3.select(`#${id}`).attr('width', width + 10 + 10)
                .attr('height', height + 10 + 10)
                .append('g')
                .attr('transform',
                    'translate(' + 10 + ',' + 10 + ')')
            let layout = cloud()
                .size([width, height])
                .words(JSON.parse(JSON.stringify(sortedWords)))
                .padding(option.padding)        //space between words
                .random(random)
                .rotate(() => {
                    return 0
                })
                //  .rotate(function() { return  (~~(Math.random() * 6) - 3)*30; })
                .fontStyle(option.fontStyle)
                .spiral(option.spiral)
                .font(option.fontFamily)
            // font size of words
            const draw = (fontSizes, attempts = 1) => {
                layout.fontSize(d => {
                    const fontScale = getFontScale(sortedWords, fontSizes, option.scale)
                    return fontScale(d.value)
                }).on('end', computedWords => {
                    const SHRINK_FACTOR = 0.95
                    const MAX_LAYOUT_ATTEMPTS = 10

                    /** KNOWN ISSUE: https://github.com/jasondavies/d3-cloud/issues/36
                     * Recursively layout and decrease font-sizes by a SHRINK_FACTOR.
                     * Bail out with a warning message after MAX_LAYOUT_ATTEMPTS.
                     */
                    if (
                        sortedWords.length !== computedWords.length &&
                        attempts <= MAX_LAYOUT_ATTEMPTS
                    ) {
                        if (attempts === MAX_LAYOUT_ATTEMPTS) {
                            console.warn(
                                `Unable to layout ${sortedWords.length -
                                computedWords.length} word(s) after ${attempts} attempts.  Consider: (1) Increasing the container/component size. (2) Lowering the max font size. (3) Limiting the rotation angles.`,
                            )
                        }

                        const minFontSize = Math.max(fontSizes[0] * SHRINK_FACTOR, 1)
                        const maxFontSize = Math.max(
                            fontSizes[1] * SHRINK_FACTOR,
                            minFontSize,
                        )

                        draw([minFontSize, maxFontSize], attempts + 1)
                    } else {
                        const node = svg
                            .selectAll('g')
                            .data(computedWords)
                            .enter()
                            .append('g')
                            .attr('transform', 'translate(' + layout.size()[0] / 2 + ',' + layout.size()[1] / 2 + ')')
                        const text = node
                            .append('text')
                            .attr('transform', function (d) {
                                return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'
                            })
                            .attr('class', 'word_text')
                            .style('font-size', getFontSize)
                            .style('fill', getWordColor)
                            .attr('font-style', option.fontStyle)
                            .attr('font-weight', option.fontWeight)
                            .attr('text-anchor', 'middle')

                            .text(function (d) {
                                return d.text
                            })
                            .on('click', d => clickHandler && clickHandler(d, d3.event))
                            .on('mouseover', d => logHandler(d, d3.event))

                        text
                            .transition()
                            .duration(1000)
                            .attr('fill', getWordColor)
                            .attr('font-family', option.fontFamily)
                            .attr('font-size', getFontSize)
                            .attr('transform', d => {
                                return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'
                            })
                            .text(function (d) {
                                return d.text
                            })
                    }

                }).start()
            }

            draw(option.fontSizes)

        }
    }, [data])

    return (
        <>
            <div>
                <svg id={id}/>
            </div>
        </>
    )
}

export default BaseWordCloud
