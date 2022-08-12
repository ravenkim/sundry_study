import * as diff2html from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';
import { useEffect, useRef, useState } from 'react';

type Props = {
  diffString: string;
};

type InclusionType = 'Included' | 'PartlyIncluded' | 'NotIncluded';

const addClass = (classString: string, className: string): string => {
  if (classString.includes(className)) {
    return classString;
  } else {
    return `${classString} ${className}`;
  }
};

const substractClass = (classString: string, className: string): string => {
  const classNameWithSeperator = ` ${className}`;
  if (classString.includes(classNameWithSeperator)) {
    return classString.replace(classNameWithSeperator, '');
  } else {
    return classString;
  }
};

const increaseNumber = (currentNumber: number, maxNumber: number) =>
  currentNumber + 1 > maxNumber ? maxNumber : currentNumber + 1;

const decreaseNumber = (currentNumber: number, minNumber: number = 0) =>
  currentNumber - 1 < minNumber ? minNumber : currentNumber - 1;

const createSpan = (id: number): HTMLElement => {
  const span = document.createElement('span');
  span.className = 'extracted-simple-text';
  span.id = `id-${id}`;
  return span;
};

const isElementIncluded = (
  element: Element,
  seletedRange: Range
): InclusionType => {
  const newRange = document.createRange();
  newRange.selectNodeContents(element);
  const startToStart = newRange.compareBoundaryPoints(
    Range.START_TO_START,
    seletedRange
  );
  const endToEnd = newRange.compareBoundaryPoints(
    Range.END_TO_END,
    seletedRange
  );
  const endToStart = newRange.compareBoundaryPoints(
    Range.END_TO_START,
    seletedRange
  );
  const startToEnd = newRange.compareBoundaryPoints(
    Range.START_TO_END,
    seletedRange
  );
  if (startToStart === -1) {
    if (endToEnd === -1 && endToStart === -1 && startToEnd === 1) {
      return 'PartlyIncluded';
    }
  } else {
    if (endToStart === -1 && startToEnd === 1) {
      if (endToEnd === -1) {
        return 'Included';
      }
      return 'PartlyIncluded';
    }
  }
  return 'NotIncluded';
};

const wrapSelectedRange = (range: Range, id: number) => {
  const ancestor = range.commonAncestorContainer;
  const seletedFragments = range.cloneContents();
  if (ancestor.nodeType === 3) {
    const span = createSpan(id);
    range.surroundContents(span);
  } else {
    const lines = Array.from(
      (ancestor as any).querySelectorAll('.d2h-code-line-ctn') as HTMLCollection
    );
    if (lines.length === 0) {
      const span = createSpan(id);
      range.surroundContents(span);
    }
    const selectedTexts = Array.from(seletedFragments.childNodes)
      .map<string | undefined>((child) => {
        if (child.nodeType === 3) {
          return child.textContent ?? undefined;
        } else {
          const codeLines = Array.from(
            (child as any).querySelectorAll(
              '.d2h-code-line-ctn'
            ) as HTMLCollection
          );
          return codeLines.length > 0 ? codeLines[0].textContent! : undefined;
        }
      })
      .filter((child) => child);
    lines.map((line) => {
      const isIncluded = isElementIncluded(line, range);
      console.log(isIncluded);
      if (isIncluded === 'Included') {
        line.setAttribute(
          'class',
          addClass(line.className, 'extracted-simple-text')
        );
        line.setAttribute('id', `id-${id}`);
      } else if (isIncluded === 'PartlyIncluded') {
        const tmpRange = document.createRange();
        tmpRange.selectNode(line);
        const matchedText = selectedTexts.find((text) =>
          line.textContent?.includes(text!)
        );
        const span = createSpan(id);
        span.textContent = matchedText!;
        line.innerHTML = line.innerHTML.replace(matchedText!, span.outerHTML);
      }
    });
  }
};

const DiffViewer = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const html = diff2html.html(props.diffString, {
    outputFormat: 'side-by-side',
    drawFileList: true,
  });
  const [fileIndex, setFileIndex] = useState(0);
  const [numberOfFiles, setNumberOfFiles] = useState(0);
  const [selectedRange, setSeletecRange] = useState<Range | undefined>(
    undefined
  );
  const [lastMarkedId, setMakedId] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const fileWrappers =
        ref.current.getElementsByClassName('d2h-file-wrapper');
      setNumberOfFiles(fileWrappers.length);
      for (let index = 0; index < fileWrappers.length; index++) {
        if (index == fileIndex) {
          const currentClass = fileWrappers[index].getAttribute('class');
          fileWrappers[index].setAttribute(
            'class',
            substractClass(currentClass ?? '', 'hidden')
          );
        } else {
          const currentClass = fileWrappers[index].getAttribute('class');
          fileWrappers[index].setAttribute(
            'class',
            addClass(currentClass ?? '', 'hidden')
          );
        }
      }
    }
  }, [html, fileIndex]);

  useEffect(() => {
    if (selectedRange) {
      wrapSelectedRange(selectedRange, lastMarkedId);
      setMakedId(lastMarkedId + 1);
    }
  }, [selectedRange]);
  return (
    <>
      <div className="flex flex-col px-12 pt-12 pb-4 h-screen">
        <div
          className="grow"
          ref={ref}
          dangerouslySetInnerHTML={{ __html: html }}
          onMouseDown={() => {
            const selection = window.getSelection();
            selection?.removeAllRanges();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);
            if (!range?.collapsed) {
              setSeletecRange(range);
            }
            selection?.removeAllRanges();
          }}
        />
        <div>
          <div className="flex flex-row py-2 space-x-4">
            <button
              className={`basis-1/2 font-bold py-2 px-4 h-12 ${
                fileIndex == 0
                  ? 'bg-zinc-200 text-zinc-500 cursor-default'
                  : 'bg-cyan-300 text-sky-900'
              }  rounded-xl flex items-center justify-center`}
              onClick={() => {
                setFileIndex(decreaseNumber(fileIndex));
              }}
            >
              Prev
            </button>
            <button
              className={`basis-1/2 font-bold py-2 px-4 h-12 ${
                fileIndex == numberOfFiles - 1
                  ? 'bg-zinc-200 text-zinc-500 cursor-default'
                  : 'bg-cyan-300 text-sky-900'
              } rounded-xl flex items-center justify-center`}
              onClick={() => {
                setFileIndex(increaseNumber(fileIndex, numberOfFiles - 1));
              }}
            >
              Next
            </button>
          </div>
          <div className="flex flex-row pt-4">
            <div
              className={`grow font-bold py-2 px-4 h-14  rounded-xl flex items-center justify-center text-cyan-300 bg-sky-900`}
            >
              Submit
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiffViewer;
