'use client'
import useDiff from '../queries/useDiff'
import { labelSelectedRange, unlabelById } from '@/utils/diff-labeler'
import { Label } from '@/utils/types'
import * as diff2html from 'diff2html'
import 'diff2html/bundles/css/diff2html.min.css'
import {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    memo,
    useCallback,
} from 'react'
import UrlForm from './UrlForm'
import {
    addClass,
    decreaseNumber,
    increaseNumber,
    substractClass,
} from '@/utils/dom'
import SSspin from '@/components/SSspin'

const DiffLabeler = () => {
    const ref = useRef<HTMLDivElement>(null)
    const [fileIndex, setFileIndex] = useState(0)
    const [labelList, setLabelList] = useState([] as Label[])
    const [numberOfFiles, setNumberOfFiles] = useState(0)
    const labelIdRef = useRef(0)
    const [selectedRange, setSelectedRange] = useState<Range | undefined>(
        undefined,
    )

    const [searchText, setSearchText] = useState('')
    const [submittedSearchText, setSubmittedSearchText] = useState('')

    const [enabled, setEnabled] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { text, time, isLoading } = useDiff({
        searchText: submittedSearchText,
        enabled,
    })

    useEffect(() => {
        if (text && enabled) {
            // Trigger when data is fetched and enabled was true
            setEnabled(false)
        }
    }, [text, enabled])

    const html = useMemo(() => {
        return diff2html.html(text || '', {
            outputFormat: 'side-by-side',
            drawFileList: false,
        })
    }, [text])

    useEffect(() => {
        if (!ref.current) {
            return
        }
        const fileWrappers =
            ref.current.getElementsByClassName('d2h-file-wrapper')
        setNumberOfFiles(fileWrappers.length)
        setFileIndex(0)
    }, [html])

    useLayoutEffect(() => {
        if (numberOfFiles == 0 || !ref.current) {
            return
        }

        const fileWrappers =
            ref.current.getElementsByClassName('d2h-file-wrapper')

        for (let index = 0; index < numberOfFiles; index++) {
            if (index == fileIndex) {
                const currentClass = fileWrappers[index].getAttribute('class')
                fileWrappers[index].setAttribute(
                    'class',
                    substractClass(currentClass ?? '', 'hidden'),
                )
            } else {
                const currentClass = fileWrappers[index].getAttribute('class')
                fileWrappers[index].setAttribute(
                    'class',
                    addClass(currentClass ?? '', 'hidden'),
                )
            }
        }
    }, [html, fileIndex, numberOfFiles])

    useEffect(() => {
        if (!selectedRange || !ref.current) return

        const startNode = selectedRange.startContainer
        let parentTd: HTMLElement | null = (
            startNode.nodeType === Node.ELEMENT_NODE
                ? startNode
                : startNode.parentElement
        ) as HTMLElement

        while (
            parentTd &&
            parentTd.tagName !== 'TD' &&
            parentTd !== ref.current
        ) {
            parentTd = parentTd.parentElement
        }

        let changeType: Label['changeType'] | undefined = undefined

        if (parentTd && parentTd.tagName === 'TD') {
            if (parentTd.classList.contains('d2h-ins')) {
                changeType = 'Inserted'
            } else if (parentTd.classList.contains('d2h-del')) {
                changeType = 'Deleted'
            }
        }

        if (!changeType) {
            return
        }

        const labeledRange = labelSelectedRange(
            selectedRange,
            labelIdRef.current,
        )

        const fileWrappers =
            ref.current.getElementsByClassName('d2h-file-wrapper')
        const currentFileWrapper = fileWrappers[fileIndex]
        const fileNameElement =
            currentFileWrapper?.getElementsByClassName('d2h-file-name')[0]
        const fileName = fileNameElement?.textContent?.trim() ?? 'unknown'

        const label: Label = {
            id: labelIdRef.current,
            selectedRange: labeledRange,
            fileName: fileName,
            changeType: changeType,
        }

        labelIdRef.current++
        setLabelList((list) => [...list, label])
    }, [selectedRange, fileIndex])

    const onSelectRange = useCallback((range: Range) => {
        setSelectedRange(range)
    }, [])

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const response = await fetch('http://localhost:3031/labels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: submittedSearchText,
                    time: time,
                    labels: labelList,
                }),
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            alert('Successfully submitted!')
        } catch (error) {
            console.error('Error submitting labels:', error)
            alert('Error submitting labels. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <div className="flex w-screen flex-col px-12 pb-4 pt-12">
                <SSspin
                    loading={isLoading || isSubmitting}
                    className={'flex w-full flex-col'}
                >
                    <div className="pb-8">
                        <UrlForm
                            onSubmit={() => {
                                setSubmittedSearchText(searchText)
                                setEnabled(true)
                            }}
                            onChange={(e) => {
                                setSearchText(e.target.value)
                            }}
                            value={searchText}
                        />
                    </div>
                    <DiffRenderer
                        html={html}
                        ref={ref}
                        onSelectRange={onSelectRange}
                    />
                    <div>
                        <div className="flex flex-row py-2">
                            <div className="flex basis-1/4 flex-row space-x-4 py-2 pr-6">
                                <button
                                    className={`flex h-12 basis-1/2 items-center justify-center rounded-xl bg-sky-900 px-4 py-2 font-bold text-cyan-300`}
                                    onClick={() => {
                                        if (labelList.length > 0) {
                                            const lastId =
                                                labelList[labelList.length - 1]
                                                    .id
                                            unlabelById(lastId)
                                            setLabelList(
                                                labelList.filter(
                                                    (label) =>
                                                        label.id != lastId,
                                                ),
                                            )
                                        }
                                    }}
                                >
                                    Undo
                                </button>
                                <button
                                    className={`flex h-12 basis-1/2 items-center justify-center rounded-xl bg-sky-900 px-4 py-2 font-bold text-cyan-300`}
                                    onClick={() => {
                                        labelList.forEach((label) => {
                                            unlabelById(label.id)
                                        })
                                        setLabelList([])
                                    }}
                                >
                                    Refresh
                                </button>
                            </div>
                            <div className="flex basis-3/4 flex-row space-x-4 py-2">
                                <button
                                    className={`h-12 basis-1/2 px-4 py-2 font-bold ${
                                        fileIndex == 0
                                            ? 'cursor-default bg-zinc-200 text-zinc-500'
                                            : 'bg-cyan-300 text-sky-900'
                                    } flex items-center justify-center rounded-xl`}
                                    onClick={() => {
                                        setFileIndex(decreaseNumber(fileIndex))
                                    }}
                                >
                                    Prev
                                </button>
                                <button
                                    className={`h-12 basis-1/2 px-4 py-2 font-bold ${
                                        fileIndex == numberOfFiles - 1
                                            ? 'cursor-default bg-zinc-200 text-zinc-500'
                                            : 'bg-cyan-300 text-sky-900'
                                    } flex items-center justify-center rounded-xl`}
                                    onClick={() => {
                                        setFileIndex(
                                            increaseNumber(
                                                fileIndex,
                                                numberOfFiles - 1,
                                            ),
                                        )
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-row pt-4">
                            <button
                                className={`flex h-14 grow items-center justify-center rounded-xl bg-sky-900 px-4 py-2 font-bold text-cyan-300 ${
                                    isSubmitting ? 'cursor-not-allowed opacity-50' : ''
                                }`}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </SSspin>
            </div>
        </>
    )
}

export default DiffLabeler

type DiffRendererProps = {
    html: string
    onSelectRange: (range: Range) => void
}

// eslint-disable-next-line react/display-name
const DiffRenderer = memo(
    forwardRef<HTMLDivElement, DiffRendererProps>(
        function DiffRenderer(props, ref) {
            const { html, onSelectRange } = props
            console.log('re rendering DiffRenderer...')

            return (
                <div
                    className="grow"
                    ref={ref}
                    dangerouslySetInnerHTML={{ __html: html }}
                    onMouseDown={() => {
                        const selection = window.getSelection()
                        selection?.removeAllRanges()
                    }}
                    onMouseUp={(e) => {
                        e.preventDefault()
                        const selection = window.getSelection()
                        if (selection && selection.rangeCount > 0) {
                            const range = selection?.getRangeAt(0)
                            if (!range?.collapsed) {
                                onSelectRange(range.cloneRange())
                            }
                            selection?.removeAllRanges()
                        }
                    }}
                />
            )
        },
    ),
)
