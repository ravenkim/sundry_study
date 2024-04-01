"use client";
import { labelSelectedRange, unlabelById } from "@/utils/diff-labeler";
import { Label } from "@/utils/types";
import * as diff2html from "diff2html";
import "diff2html/bundles/css/diff2html.min.css";
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  memo,
  useCallback,
} from "react";
import UrlForm from "./UrlForm";
import {
  addClass,
  decreaseNumber,
  increaseNumber,
  substractClass,
} from "@/utils/dom";

type Props = {
  diffString: string;
};

const DiffLabeler = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [fileIndex, setFileIndex] = useState(0);
  const [labelList, setLabelList] = useState([] as Label[]);
  const [numberOfFiles, setNumberOfFiles] = useState(0);
  const labelIdRef = useRef(0);
  const [selectedRange, setSelectedRange] = useState<Range | undefined>(
    undefined
  );

  const html = useMemo(() => {
    return diff2html.html(props.diffString, {
      outputFormat: "side-by-side",
      drawFileList: false,
    });
  }, [props.diffString]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const fileWrappers = ref.current.getElementsByClassName("d2h-file-wrapper");
    setNumberOfFiles(fileWrappers.length);
  }, [fileIndex, numberOfFiles]);

  useLayoutEffect(() => {
    if (numberOfFiles == 0 || !ref.current) {
      return;
    }

    const fileWrappers = ref.current.getElementsByClassName("d2h-file-wrapper");

    for (let index = 0; index < numberOfFiles; index++) {
      if (index == fileIndex) {
        const currentClass = fileWrappers[index].getAttribute("class");
        fileWrappers[index].setAttribute(
          "class",
          substractClass(currentClass ?? "", "hidden")
        );
      } else {
        const currentClass = fileWrappers[index].getAttribute("class");
        fileWrappers[index].setAttribute(
          "class",
          addClass(currentClass ?? "", "hidden")
        );
      }
    }
  }, [html, fileIndex, numberOfFiles]);

  useEffect(() => {
    if (!selectedRange) return;
    const labeledRange = labelSelectedRange(selectedRange, labelIdRef.current);

    const label: Label = {
      id: labelIdRef.current,
      selectedRange: labeledRange,
      fileName: "",
      changeType: "Inserted",
    };

    labelIdRef.current++;
    setLabelList((list) => [...list, label]);
  }, [selectedRange]);

  const onSelectRange = useCallback((range: Range) => {
    setSelectedRange(range);
  }, []);

  return (
    <>
      <div className="flex flex-col px-12 pt-12 pb-4 h-screen">
        <div className="pb-8">
          <UrlForm />
        </div>
        <DiffRenderer html={html} ref={ref} onSelectRange={onSelectRange} />
        <div>
          <div className="flex flex-row py-2">
            <div className=" basis-1/4 flex flex-row py-2 space-x-4 pr-6">
              <button
                className={`basis-1/2 font-bold py-2 px-4 h-12 text-cyan-300 bg-sky-900  rounded-xl flex items-center justify-center`}
                onClick={() => {
                  if (labelList.length > 0) {
                    const lastId = labelList[labelList.length - 1].id;
                    unlabelById(lastId);
                    setLabelList(
                      labelList.filter((label) => label.id != lastId)
                    );
                  }
                }}
              >
                Undo
              </button>
              <button
                className={`basis-1/2 font-bold py-2 px-4 h-12 text-cyan-300 bg-sky-900  rounded-xl flex items-center justify-center`}
                onClick={() => {
                  labelList.forEach((label) => {
                    unlabelById(label.id);
                  });
                  setLabelList([]);
                }}
              >
                Refresh
              </button>
            </div>
            <div className="basis-3/4 flex flex-row py-2 space-x-4">
              <button
                className={`basis-1/2 font-bold py-2 px-4 h-12 ${
                  fileIndex == 0
                    ? "bg-zinc-200 text-zinc-500 cursor-default"
                    : "bg-cyan-300 text-sky-900"
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
                    ? "bg-zinc-200 text-zinc-500 cursor-default"
                    : "bg-cyan-300 text-sky-900"
                } rounded-xl flex items-center justify-center`}
                onClick={() => {
                  setFileIndex(increaseNumber(fileIndex, numberOfFiles - 1));
                }}
              >
                Next
              </button>
            </div>
          </div>
          <div className="flex flex-row pt-4">
            <button
              className={`grow font-bold py-2 px-4 h-14  rounded-xl flex items-center justify-center text-cyan-300 bg-sky-900`}
              onClick={() => {
                console.log(labelList);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiffLabeler;

type DiffRendererProps = {
  html: string;
  onSelectRange: (range: Range) => void;
};

// eslint-disable-next-line react/display-name
const DiffRenderer = memo(
  forwardRef<HTMLDivElement, DiffRendererProps>(function DiffRenderer(
    props,
    ref
  ) {
    const { html, onSelectRange } = props;
    console.log("re rendering DiffRenderer...");

    return (
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
              onSelectRange(range.cloneRange());
            }
            selection?.removeAllRanges();
          }
        }}
      />
    );
  })
);
