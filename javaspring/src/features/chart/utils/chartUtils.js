/**
 * Curve chart Legend Color 가져오는 함수
 * @param nm
 * @returns {string}
 */
import { getColor } from "utils/commonUtils";

export const getCurveStackbarlegendColor = (nm) => {
  let cl = "#000000";
  if (nm === undefined) {
    cl = "#000000";
  } else {
    if (nm === "특허") cl = "#394dfb";
    else if (nm === "논문") cl = "#01b5d4";
    else if (nm === "NTIS 과제") cl = "#00479e";
    else if (nm === "KEIT 과제") cl = "#6d36b9";
    else if (nm === "KEIT 과제") cl = "#368df8";
    else cl = getColor((nm.charCodeAt(0) + nm.charCodeAt(nm.length - 1)) % 40);
  }

  return cl;
};
