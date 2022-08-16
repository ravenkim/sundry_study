import * as diff2html from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';
import { useEffect, useRef, useState } from 'react';
import { Label, Props } from '.';
import {
  addClass,
  decreaseNumber,
  increaseNumber,
  substractClass,
} from '../../shared/utils';
import { labelSelectedRange } from './diff-labeler.logic';

const DiffLabeler = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const html = diff2html.html(props.diffString, {
    outputFormat: 'side-by-side',
    drawFileList: true,
  });
  const [fileIndex, setFileIndex] = useState(0);
  const [labelList, setLabelList] = useState([] as Label[]);
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
      const labeledRange = labelSelectedRange(selectedRange, lastMarkedId);
      const label: Label = {
        id: lastMarkedId,
        selectedRange: labeledRange,
        fileName: '',
        changeType: 'Inserted',
      };
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

export default DiffLabeler;
