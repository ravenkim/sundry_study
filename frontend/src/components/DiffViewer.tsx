import * as diff2html from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';
import { useEffect, useRef, useState } from 'react';

type Props = {
  diffString: string;
};

type Position = {
  row: number;
  column: number;
};

type SelectedRange = [Position, Position];

type InclusionType =
  | 'Included'
  | 'Include'
  | 'PartlyIncluded'
  | 'NotIncluded'
  | 'StartIncluded'
  | 'EndIncluded';

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

const handleEndIncluded = (node: Node, range: Range, id: number) => {
  if (needToMarkUp(node, range, id)) {
    const span = createSpan(id);
    span.textContent = range.endContainer.textContent!.slice(
      0,
      range.endOffset
    );
    const after = range.endContainer.textContent!.slice(range.endOffset);
    range.endContainer.parentElement?.insertBefore(span, range.endContainer);
    range.endContainer.parentElement?.insertBefore(
      document.createTextNode(after),
      range.endContainer
    );
    range.endContainer.parentElement?.removeChild(range.endContainer);
  }
};

const handleStartIncluded = (node: Node, range: Range, id: number) => {
  if (needToMarkUp(node, range, id)) {
    const span = createSpan(id);
    span.textContent = range.startContainer.textContent!.slice(
      range.startOffset
    );
    const before = range.startContainer.textContent!.slice(
      0,
      range.startOffset
    );
    range.startContainer.parentElement?.insertBefore(
      document.createTextNode(before),
      range.startContainer
    );
    range.startContainer.parentElement?.insertBefore(
      span,
      range.startContainer
    );
    range.startContainer.parentElement?.removeChild(range.startContainer);
  }
};

const handleIncluded = (node: Node, range: Range, id: number) => {
  if (needToMarkUp(node, range, id)) {
    const span = createSpan(id);
    span.textContent = node.textContent;
    if (node.nodeType === 1) {
      const element = node as Element;
      element.innerHTML = span.outerHTML;
    } else {
      node.parentElement?.replaceChild(span, node);
    }
  }
};

const needToMarkUp = (node: Node, range: Range, id: number) => {
  if (node.nodeType === 1) {
    const element = node as Element;
    if (element.className!.includes('extracted-simple-text')) {
      return false;
    }
    if (node.hasChildNodes()) {
      Array.from(node.childNodes).forEach((child) => {
        handleNode(child, range, id);
      });
      return false;
    }
  }
  return true;
};

const handleInclude = (node: Node, range: Range, id: number) => {
  if (needToMarkUp(node, range, id)) {
    const span = createSpan(id);
    const before = range.startContainer.textContent!.slice(
      0,
      range.startOffset
    );
    const selected = range.startContainer.textContent!.slice(
      range.startOffset,
      range.endOffset
    );
    const after = range.startContainer.textContent!.slice(range.endOffset);
    span.textContent = selected;
    range.startContainer.parentElement?.insertBefore(
      document.createTextNode(before),
      range.startContainer
    );
    range.startContainer.parentElement?.insertBefore(
      span,
      range.startContainer
    );
    range.startContainer.parentElement?.insertBefore(
      document.createTextNode(after),
      range.startContainer
    );
    range.startContainer.parentElement?.removeChild(range.startContainer);
  }
};

const isElementIncluded = (
  element: Element | Node,
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
  console.log(
    `${element.textContent} ${startToStart}, ${endToEnd}, ${endToStart}, ${startToEnd}`
  );
  if (
    startToStart === 1 &&
    endToEnd === 1 &&
    endToStart === -1 &&
    startToEnd === 1
  ) {
    return 'EndIncluded';
  }
  if (
    startToStart === 1 &&
    endToEnd === 0 &&
    endToStart === -1 &&
    startToEnd === 1
  ) {
    return 'EndIncluded';
  } else if (
    startToStart === -1 &&
    endToEnd === -1 &&
    endToStart === -1 &&
    startToEnd === 1
  ) {
    return 'StartIncluded';
  } else if (
    startToStart === 1 &&
    endToEnd === -1 &&
    endToStart === -1 &&
    startToEnd === 1
  ) {
    return 'Included';
  } else if (
    startToStart === 0 &&
    endToEnd === 0 &&
    endToStart === -1 &&
    startToEnd === 1
  ) {
    return 'Included';
  } else if (
    startToStart === 0 &&
    endToEnd === -1 &&
    endToStart === -1 &&
    startToEnd === 1
  ) {
    return 'Included';
  } else if (
    startToStart === -1 &&
    endToEnd === 1 &&
    endToStart === -1 &&
    startToEnd === 1
  ) {
    return 'Include';
  } else if (
    startToStart === -1 &&
    endToEnd === 0 &&
    endToStart === -1 &&
    startToEnd === 1
  ) {
    return 'Include';
  } else if (
    startToStart === 0 &&
    endToEnd === 1 &&
    endToStart === -1 &&
    startToEnd === 1
  ) {
    return 'Include';
  } else {
    return 'NotIncluded';
  }
};

const wrapSelectedRange = (range: Range, id: number) => {
  const clonedRange = range.cloneRange();

  const lines = findIncludedLinesFromAll(range);
  const lineNumbers = lines
    .map((line) => findPrefixFromLine(line))
    .filter((number) => number !== undefined) as number[];
  const seletedCodeRange = getStartAndEndPosition(range, lineNumbers);

  lines.forEach((line) => {
    // const inclusionTypes = Array.from(line.childNodes).map((node) =>
    //   isElementIncluded(node, range)
    // );
    Array.from(line.childNodes).forEach((node, i) => {
      handleNode(node, range, id);
    });
  });

  // console.log(seletedCodeRange[0].column, seletedCodeRange[1].column);
  // if (lines.length == 1) {
  //   const line = lines[0];
  //   const before = line.textContent?.slice(0, seletedCodeRange[0].column);
  //   const included = line.textContent?.slice(
  //     seletedCodeRange[0].column,
  //     seletedCodeRange[1].column
  //   );
  //   const after = line.textContent?.slice(seletedCodeRange[1].column);
  //   const span = createSpan(id);
  //   span.textContent = included!;
  //   line.innerHTML = before + span.outerHTML + after;
  // } else {
  //   const startLine = lines[0];
  //   const before = startLine.textContent?.slice(0, seletedCodeRange[0].column);
  //   const includedStart = startLine.textContent?.slice(
  //     seletedCodeRange[0].column
  //   );
  //   const startSpan = createSpan(id);
  //   startSpan.textContent = includedStart!;
  //   startLine.innerHTML = before + startSpan.outerHTML;
  //   const endLine = lines[lines.length - 1];
  //   const includedEnd = endLine.textContent?.slice(
  //     0,
  //     seletedCodeRange[1].column
  //   );
  //   const after = endLine.textContent?.slice(seletedCodeRange[1].column);
  //   const endSpan = createSpan(id);
  //   endSpan.textContent = includedEnd!;
  //   endLine.innerHTML = endSpan.outerHTML + after;
  //   lines.forEach((line, i) => {
  //     if (i !== 0 && i !== lines.length - 1) {
  //       line.setAttribute(
  //         'class',
  //         addClass(line.className, 'extracted-simple-text')
  //       );
  //     }
  //   });
  // }
};

const handleNode = (node: Node, range: Range, id: number) => {
  const inclusionType = isElementIncluded(node, range);
  if (inclusionType === 'EndIncluded') {
    console.log('🧪', ' in DiffViewer: ', 'end node: ', node);
    handleEndIncluded(node, range, id);
  }
  if (inclusionType === 'Included') {
    console.log('🧪', ' in DiffViewer: ', 'included node: ', node);
    handleIncluded(node, range, id);
  }
  if (inclusionType === 'Include') {
    console.log('🧪', ' in DiffViewer: ', 'include node: ', node);
    handleInclude(node, range, id);
  }
  if (inclusionType === 'StartIncluded') {
    console.log('🧪', ' in DiffViewer: ', 'start node: ', node);
    handleStartIncluded(node, range, id);
  }
};

const findIncludedLinesFromAll = (range: Range) =>
  Array.from(document.querySelectorAll('.d2h-code-line-ctn')).filter((line) => {
    const isIncluded = isElementIncluded(line, range);
    return isIncluded != 'NotIncluded';
  });

const findPrefixFromLine = (line: Element) => {
  const found = line.parentElement?.parentElement?.previousElementSibling;
  const text = found?.textContent?.trim();
  if (text?.length == 0) return;
  return text ? parseInt(text) : undefined;
};

const getStartAndEndPosition = (
  range: Range,
  lineNumbers: number[]
): SelectedRange => {
  const startColumn =
    range.startOffset + getPreviousTextLength(range.startContainer);
  const endColumn = range.endOffset + getPreviousTextLength(range.endContainer);
  const startRow = Math.min(...lineNumbers);
  const endRow = Math.max(...lineNumbers);
  return [
    { row: startRow, column: startColumn },
    { row: endRow, column: endColumn },
  ];
};

const getPreviousTextLength = (node: Node) => {
  const parentElement = node.parentElement;
  if (parentElement && parentElement.className.includes('d2h-code-line-ctn')) {
    if (node.previousSibling) {
      const siblings = getPreviousSibling(node.previousSibling, [
        node.previousSibling,
      ]);
      const prevTextLength = siblings
        .map<number>((sibling) => sibling.textContent?.length ?? 0)
        .reduce((prev, curr) => prev + curr, 0);
      return prevTextLength;
    } else {
      return 0;
    }
  } else {
    const siblings = getPreviousSibling(node.parentElement!, []);
    const prevTextLength = siblings
      .map<number>((sibling) => sibling.textContent?.length ?? 0)
      .reduce((prev, curr) => prev + curr, 0);
    return prevTextLength;
  }
};

const getPreviousSibling = (element: Node, siblings: Node[]): Node[] => {
  const sibling = element.previousSibling;
  if (sibling) {
    return getPreviousSibling(sibling, [...siblings, sibling]);
  } else {
    return [...siblings];
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
            if (selection && selection.rangeCount > 0) {
              const range = selection?.getRangeAt(0);
              if (!range?.collapsed) {
                setSeletecRange(range.cloneRange());
              }
              selection?.removeAllRanges();
            }
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
