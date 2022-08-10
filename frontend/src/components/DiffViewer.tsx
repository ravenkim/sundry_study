import * as diff2html from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';
import { useEffect, useRef } from 'react';

type Props = {
  diffString: string;
  index: number;
};

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

const DiffViewer = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const html = diff2html.html(props.diffString);

  useEffect(() => {
    if (ref.current) {
      const fileWrappers =
        ref.current.getElementsByClassName('d2h-file-wrapper');
      for (let index = 0; index < fileWrappers.length; index++) {
        if (index == props.index) {
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
  }, [html]);
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default DiffViewer;
