import { InclusionType, SelectedRange } from '.';
import {
  DIFF2HTML_LINE_CLASS_NAME,
  LABEL_CLASS_NAME,
  LABEL_ID_PREFIX,
} from './constants';

export const labelSelectedRange = (range: Range, id: number): SelectedRange => {
  const lines = findIncludedLinesFromAll(range);
  const lineNumbers = lines
    .map((line) => findPrefixFromLine(line))
    .filter((number) => number !== undefined) as number[];
  const seletedCodeRange = getStartAndEndPosition(range, lineNumbers);

  lines.forEach((line) => {
    Array.from(line.childNodes).forEach((node, i) => {
      handleNode(node, range, id);
    });
  });

  return seletedCodeRange;
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
  // console.log(
  //   `${element.textContent} ${startToStart}, ${endToEnd}, ${endToStart}, ${startToEnd}`
  // );
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

const handleNode = (node: Node, range: Range, id: number) => {
  const inclusionType = isElementIncluded(node, range);
  if (inclusionType === 'EndIncluded') {
    handleEndIncluded(node, range, id);
  } else if (inclusionType === 'Included') {
    handleIncluded(node, range, id);
  } else if (inclusionType === 'Include') {
    handleInclude(node, range, id);
  } else if (inclusionType === 'StartIncluded') {
    handleStartIncluded(node, range, id);
  }
};

const findIncludedLinesFromAll = (range: Range) =>
  Array.from(document.querySelectorAll(`.${DIFF2HTML_LINE_CLASS_NAME}`)).filter(
    (line) => {
      const isIncluded = isElementIncluded(line, range);
      return isIncluded != 'NotIncluded';
    }
  );

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
  if (
    parentElement &&
    parentElement.className.includes(DIFF2HTML_LINE_CLASS_NAME)
  ) {
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

const createSpan = (id: number): HTMLElement => {
  const span = document.createElement('span');
  span.className = LABEL_CLASS_NAME;
  span.id = `${LABEL_ID_PREFIX}${id}`;
  return span;
};
