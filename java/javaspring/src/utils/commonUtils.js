import { store } from "../index";
import moment from "moment";
import React from "react";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const getOrderList = () => {
  const state = store.getState();
  try {
    const orderList = state.mainContents.orderList;
    if (!orderList) return [];
    return orderList;
  } catch (e) {
    console.error(e);
  }
};
// 카테고리 리스트 불러오는 함수
export const getCategoryList = () => {
  const state = store.getState();
  try {
    const categoryList = state.commReducer.category;
    if (!categoryList) return [];
    return categoryList;
  } catch (e) {
    console.error(e);
  }
};

/**
 * 카테고리리스트의 section 리스트를 반환하는 함수
 * @returns Array [{section: "A", sectionCon: "생활필수품"},{ …}]
 */
export const getCategorySectionList = () => {
  const category = getCategoryList();
  // if (!category) return null;
  return category.map(({ section, sectionCon }) => {
    return { section: section, sectionCon: sectionCon };
  });
};

/**
 * 카테고리리스트의 section값을 보내면 해당하는 value를 반환하는 함수
 * @param section_str 섹션이름 ('A')
 * @returns String
 */
export const getCategorySection = (section_str) => {
  const category = getCategoryList();
  // if (!category) return null;
  return category.filter(({ section }) => section === section_str)[0]
    .sectionCon;
};

/**
 * 카테고리리스트의 section 값을 받아와 classField 리스트를 반환하는 함수
 * @param section_str 섹션이름 ('A')
 * @returns Array [{classField: "A01", classCon: "농업; 임업; 축산; 수렵; 포획; 어업"}, {…}, ]
 */
export const getCategoryClassList = (section_str) => {
  const category = getCategoryList();
  // if (!category) return null;
  return category
    .filter(({ section }) => section === section_str)
    .map(({ children }) => children)
    .flat()
    .map(({ classField, classCon }) => {
      return { classField: classField, classCon: classCon };
    });
};

/**
 * 카테고리리스트의 class 값을 받아와 class value를 반환하는 함수
 * @param class_str 클래스이름('A01')
 * @returns String
 */
export const getCategoryClass = (class_str) => {
  const category = getCategoryList();
  // if (!category) return null;
  const section_str = class_str.substring(0, 1);
  return category
    .filter(({ section }) => section === section_str)
    .map(({ children }) => children)
    .flat()
    .filter(({ classField }) => classField === class_str)[0].classCon;
};

/**
 * 카테고리리스트의 class 값을 받아와 subclass 리스트를 반환하는 함수
 * @param class_str 클래스이름 ('A01')
 * @returns Array [{subclass: "A01H", subclassCon: "새로운 식물 또는 그것들을 얻기 위한 육종처리; 조직배양기술에 의한 식물의 증식   [1990.01]"}, {…}]
 */
export const getCategorySubclassList = (class_str) => {
  const category = getCategoryList();
  // if (!category) return null;
  const section_str = class_str.substring(0, 1);
  return category
    .filter(({ section }) => section === section_str)
    .map(({ children }) => children)
    .flat()
    .filter(({ classField }) => classField === class_str)
    .map(({ children }) => children)
    .flat()
    .map(({ subclass, subclassCon }) => {
      return { subclass: subclass, subclassCon: subclassCon };
    });
};

/**
 *  카테고리리스트의 subclass 값을 받아와 해당하는 value를 반환하는 함수
 * @param subclass_str 찾고자하는 subclass 키 ('A01H')
 * @returns String
 */
export const getCategorySubclass = (subclass_str) => {
  const category = getCategoryList();
  // if (!category) return null;
  if (category.length > 0) {
    const section_str = subclass_str.substring(0, 1);
    const classField_str = subclass_str.substring(0, 3);
    return category
      .filter(({ section }) => section === section_str)
      .map(({ children }) => children)
      .flat()
      .filter(({ classField }) => classField === classField_str)
      .map(({ children }) => children)
      .flat()
      .filter(({ subclass }) => subclass === subclass_str)[0].subclassCon;
  }
};

// 로그인 여부 확인
export const isUserLogin = (getInfo = false) => {
  // const state = store.getState();
  // try {
  //   const user = state.user.user;
  //   if (getInfo) return user;
  //   return !!user;
  // } catch (e) {
  //   console.error(e);
  // }
  return false;
};

export const authHeaderList = () => {
  const state = store.getState();
  //CL001001000 공통, CL001002000 회원, CL001003000 비회원, CL001004000 관리자
  try {
    const headerList = state.commReducer.headerList;
    if (headerList) {
      if (isUserLogin()) {
        return headerList.filter(
          ({ authAdmnSeCd }) => authAdmnSeCd !== "CL001003000"
        );
      } else {
        return headerList.filter(
          ({ authAdmnSeCd }) => authAdmnSeCd !== "CL001002000"
        );
      }
    }
    return [];
  } catch (e) {
    console.error(e);
  }
};

/**
 * 리덕스 state의 kojicList 반환하는 함수
 * @returns Array [{...}, {...}, ....]
 */
export const getKojicList = () => {
  const state = store.getState();
  try {
    const kojicList = state.commReducer.kojicList;
    if (!kojicList) return [];
    return kojicList;
  } catch (e) {
    console.error(e);
  }
};

/**
 * kojicList의 org 리스트를 반환하는 함수
 * @returns Array [{orgSeq: 1, orgnamek: "(사)한국여성벤처협회"},{ …}]
 */
export const getKojicOrgList = () => {
  const kojicList = getKojicList();
  return kojicList.map(({ orgSeq, orgnamek }) => {
    return { orgSeq: orgSeq, orgnamek: orgnamek };
  });
};

/**
 * kojicList의 orgSeq를 보내면 해당하는 기관 이름을 반환하는 함수
 * @param orgSeq_param 기관순서('1'||1) (String||Integer)
 * @returns String "(사)한국여성벤처협회"
 */
export const getKojicOrgName = (orgSeq_param) => {
  const orgSeq_no = () => {
    if (typeof orgSeq_param === "string") return parseInt(orgSeq_param);
    else return orgSeq_param;
  };

  const kojicList = getKojicList();
  return kojicList.filter(({ orgSeq }) => orgSeq === orgSeq_no())[0].orgnamek;
};

/**
 * kojicList의 orgSeq 값을 받아와 Journal의 리스트를 반환하는 함수
 * @param orgSeq_param 기관순서('1'||1) (String||Integer)
 * @returns Array [{kojic: "HRDSAA", orgnamee: "한국환경독성학회:학술대회논문집"}, {…}, ]
 */
export const getKojicJournalList = (orgSeq_param) => {
  const orgSeq_no = () => {
    if (typeof orgSeq_param === "string") return parseInt(orgSeq_param);
    else return orgSeq_param;
  };
  const kojicList = getKojicList();

  return kojicList
    .filter(({ orgSeq }) => orgSeq === orgSeq_no())
    .map(({ children }) => children)
    .flat()
    .map(({ kojic, orgnamee }) => {
      return { kojic: kojic, orgnamee: orgnamee };
    });
};

/**
 * kojicList의 kojic 값을 받아와 Journal의 이름을 반환하는 함수
 * @param kojic 값('HRDSAA')
 * @returns String "한국환경독성학회:학술대회논문집"
 */
export const getKojicJournalName = (kojic_str) => {
  const kojicList = getKojicList();

  return kojicList
    .map(({ children }) => children)
    .flat()
    .filter(({ kojic }) => kojic === kojic_str)[0].orgnamee;
};
/**
 * kojicList의 kojic 값을 받아와 OrgSeq값을 반환하는 함수
 * @param kojic 값('HRDSAA')
 * @returns 1
 */
export const getKojicOrgSeq = (kojic) => {
  const kojicList = getKojicList();
  let orgSeq = null;
  kojicList.map(({ children }) => {
    children.map((child) => {
      if (child.kojic === kojic) {
        orgSeq = child.orgSeq;
      }
    });
  });
  return orgSeq;
};

/*
  검색 키워드에 특수문자가 포함되어 있는지 체크하고
  특수문자로 split해서 wordList 반환
*/
export const checkFormatSearchKeyword = (keyword) => {
  const format = /^[\wㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/;
  let wordList = [];
  if (keyword) {
    if (!format.test(keyword)) {
      keyword.split("").map((str) => {
        if (!format.test(str)) {
          keyword = keyword.replace(str, ",");
        }
      });
      wordList = keyword
        .split(",")
        .filter((item, idx, array) => {
          return array.indexOf(item) === idx;
        })
        .filter((item) => item !== "");
      return wordList;
    } else {
      wordList = [keyword];
    }
  }
  return wordList;
};

/**
 * 회원의 검색기록을 저장한다.
 * @param userName 로그인한 회원 ID
 * @param filterData 검색할때 입력한 KEYWORD 및 FILTER DATA
 */
export const setLocalStorageSearchFilter = (userName, filterData) => {
  const today = new Date();
  const searchDate = today.getMonth() + 1 + "." + today.getDate();
  const words = filterData.words;

  const searchData = {
    date: searchDate,
    words: words,
  };

  let userSearchHistory = getLocalStorageSearchHistory(userName);

  if (userSearchHistory) {
    userSearchHistory = userSearchHistory.filter(
      (item) => item.words.toString() !== words.toString()
    );
    userSearchHistory.unshift(searchData);
    localStorage.setItem(
      userName + "_searchHistory",
      JSON.stringify(userSearchHistory)
    );
  } else {
    localStorage.setItem(
      userName + "_searchHistory",
      JSON.stringify([searchData])
    );
  }
};

/**
 * 회원의 검색기록을 가져온다.
 * @param userName 로그인 회원 ID
 * @returns 데이터가 있으면 {array}, 없으면 null
 */
export const getLocalStorageSearchHistory = (userName) => {
  return JSON.parse(localStorage.getItem(userName + "_searchHistory"));
};

// 로그인 회원 이름
export const getUserName = () => {
  const state = store.getState();
  try {
    const user = state.user.user;
    if (user) {
      return user.user.username;
    }
    return null;
  } catch (e) {
    console.error(e);
  }
};
export const getUserId = () => {
  const state = store.getState();
  try {
    const user = state.user.user;
    if (user) {
      return user.clmbrsId;
    }
    return null;
  } catch (e) {
    console.error(e);
  }
};

//긴문자열을 maxlength만큼만 출력하고 줄임말 표시를 붙여줍니다.
export const stringToSubstring = (str, maxLength) => {
  if (!maxLength || maxLength === 0) {
    return "";
  } else if (str && str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  } else {
    return nullToString(str);
  }
};

//긴문자열을 maxlength만큼만 출력하고 줄임말 표시를 붙여줍니다.
export const nullToString = (str) => {
  if (str) {
    return String(str);
  } else {
    return "";
  }
};

//긴문자열을 maxlength만큼만 출력하고 줄임말 표시를 붙여줍니다.
export const nullToReplace = (str, emptyStr) => {
  if (str) {
    return String(str);
  } else {
    return emptyStr;
  }
};

// 색상 상세 색도 조절하여 랜덤
export const getRamdomCustomColor = (
  r_min = 0,
  r_max = 255,
  g_min = 0,
  g_max = 255,
  b_min = 0,
  b_max = 255
) => {
  const red = getRandomIntInclusive(r_min, r_max),
    green = getRandomIntInclusive(g_min, g_max),
    blue = getRandomIntInclusive(b_min, b_max);
  return "rgb(" + red + "," + green + "," + blue + ")";
};

// 최솟값, 최댓값을 포함하는 정수 난수 생성하기
export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
};

export const isNumeric = (data) => {
  return !isNaN(data);
};

// byte size를 파라미터로 던지면 사이즈에 맞게 크기표시를 바꿔준다.
export const bytesToSize = (bytes) => {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
};

/**
 * url 파라미터 값 조정해서 오브젝트 반환하는 함수
 */
export const getURLQueryObj = (paramObj) => {
  let URLobj = {};
  for (let [key, value] of Object.entries(paramObj)) {
    if (typeof value === "number" || (value && value.length > 0)) {
      URLobj[key] = value;
    }
  }
  return URLobj;
};

/**
 * moment js  -> mysql datetime
 */
moment.prototype.toMySqlDateTime = function () {
  return this.format("YYYY-MM-DD HH:mm:ss");
};

/**
 * \n split 해서 보여주는 함수
 */
export const splitToBrTag = (str) => {
  if (str && str.length > 0) {
    return str.split("\n").map((line, index) => {
      return (
        <>
          {line}
          <br key={index} />
        </>
      );
    });
  } else {
    nullToString(str);
  }
};

/**
 * 글자수 길이 반환
 * @param str : string
 */
export const checkBytes = (str) => {
  let returnLength = 0;
  let returnBytes = 0;
  for (let i = 0; i < str.length; i++) {
    const oneChar = escape(str.charAt(i));
    if (oneChar.length === 1) {
      returnBytes++;
    } else if (oneChar.indexOf("%u") !== -1) {
      returnBytes += 2;
    } else if (oneChar.indexOf("%") !== -1) {
      returnBytes++;
    }
  }
  return Number(returnBytes);
};

/**
 * moment를 활용한 antd RangePicker 관련 함수
 */
export function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

export function disabledDate(current) {
  // Can not select days before today and today
  // return current && current < moment().endOf("day");
  const now = moment();
  return current && current < now.subtract(1, "day");
}

export function disabledDateTime() {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  };
}

export function disabledRangeTime(_, type) {
  return {
    disabledHours: () => range(0, 60).splice(20, 0),
    disabledMinutes: () => range(60, 60),
    disabledSeconds: () => [55, 56],
  };
}

// object 관련 함수
const traverseAndFlatten = (currentNode, target, flattenedKey) => {
  for (let key in currentNode) {
    if (currentNode.hasOwnProperty(key)) {
      let newKey;
      if (flattenedKey === undefined) {
        newKey = key;
      } else {
        newKey = flattenedKey + "." + key;
      }

      let value = currentNode[key];
      if (typeof value === "object") {
        traverseAndFlatten(value, target, newKey);
      } else {
        target[newKey] = value;
      }
    }
  }
};

/**
 * 다층 구조의 object를 flat하게 return.
 * @param obj
 * @returns {... 2.children.8.children.4.title : "게임 및 u-러닝"...}
 */
export const flatten = (obj) => {
  let flattenedObject = {};
  traverseAndFlatten(obj, flattenedObject);
  return flattenedObject;
};

/**
 * 현재시간이 기간 내에 존재하는지 반환
 * @param startDate -> string : 시작일자
 * @param endDate -> string : 종료일자
 * @param baseDate -> string : 기준일자
 * @param granularity -> string : 비교 기준. day, year 등
 * @returns {boolean|boolean}
 */
export const isValidDate = ({
  startDate,
  endDate,
  baseDate,
  granularity = "day",
}) => {
  let momentBaseDate = baseDate ? moment(baseDate) : moment();
  const isEndDeBefore =
    momentBaseDate.isBefore(endDate, granularity) ||
    momentBaseDate.isSame(endDate, granularity);
  const isStrDeAfter =
    momentBaseDate.isAfter(startDate, granularity) ||
    momentBaseDate.isSame(startDate, granularity);
  return isEndDeBefore && isStrDeAfter;
};

/**
 * array의 string을 공백으로 이어서 한 문장으로 반환
 */
export const getSpaceString = (stringList) => {
  if (!stringList || stringList.length === 0) return "";
  let rtnStr = "";
  for (let i = 0; i < stringList.length; i++) {
    if (i === 0) {
      rtnStr += stringList[i];
    } else {
      rtnStr += " " + stringList[i];
    }
  }
  return rtnStr;
};

/**
 * localStorage에 key, value 저장
 * 덮어씀
 */
export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// list의 rage(start, stop) 만큼 잘라서 return
export const listRange = (list, start, stop) => {
  let result = [];
  for (let i = start; i < stop; i += 1) {
    result.push(list[i]);
  }
  return result;
};

export const numberForamat = (num) => {
  let returnNumber = num;
  if (typeof returnNumber === "number") {
    returnNumber = returnNumber.toString();
  }
  return returnNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

let colors = [
  "37b24d",
  "f76707",
  "d6336c",
  "7048e8",
  "ff4f81",
  "0a8ea0",
  "ffc20e",
  "009f4d",
  "7d3f98",
  "ff9933",
  "136ad5",
  "84bd00",
  "1976d2",
  "1098ad",
  "ae3ec9",
  "7f181b",
  "0389ff",
  "fc636b",
  "1aafd0",
  "ea1d5d",
  "0061d5",
  "00b2a9",
  "aea400",
  "00aee6",
  "a626aa",
  "5ecc62",
  "ff6319",
  "44c7f4",
  "d52685",
  "00d1b2",
  "c68143",
  "ae63e4",
  "237f52",
  "109dc0",
  "47cf73",
  "ff7243",
  "c68143",
  "fcd000",
  "52057f",
  "0ebeff",
];
export const getColor = (n) => {
  return "#" + colors[n % 40];
};

// 공백 있는지 확인하는 함수
export const checkContainsSpace = (str) => {
  const reg = /[\s]/g;
  if (reg.test(str)) {
    alert("공백 없이 입력해주세요.");
    return false;
  } else {
    return true;
  }
};

export const emailSpilt = (email) => {
  // 소셜회원의 경우 이메일 중복문제로 DB 상에 _naver 식으로 들어가 있는데 회원에게 보여줄 때는 잘라서 보여준다.
  const emailSplitList = email.split("@");
  const emailProvider = emailSplitList[emailSplitList.length - 1];
  const underbarIndex = emailProvider.lastIndexOf("_");
  if (underbarIndex === -1) return email;
  return emailSplitList[0] + "@" + emailProvider.slice(0, underbarIndex);
};

export const getEmailDomain = (email) => {
  const originEmail = emailSpilt(email);
  const emailSplitList = originEmail.split("@");
  if (emailSplitList.length !== 2) {
    return "";
  }
  return "@" + emailSplitList[1];
};

/**
 * 이미지 Download Handler
 * @param  id html 태그 id값, str
 * @param  downloadFileName
 * 해당 id를 가진 div 태그 추출(없으면 className 첫번째 태그 추출)
 * 추출된 div 태그 내에 canvas 태그가 있으면 canvas 이미지로 다운로드
 * 추출된 div 태그 내에 canvas 태그가 없으면 div 태그에 canvas 태그 insert 및 이미지로 다운로드
 * 사용 예시: SociogranLight.js 271 line
 */
export const imageDownload = (id, downloadFileName = "제목없음") => {
  if (!id || typeof id != "string") return console.error("invalid id");

  let divTag = document.getElementById(id);
  if (!divTag) {
    console.error("no such div id tag");
    divTag = document.getElementsByClassName(id)[0];
  }
  divTag =
    undefined || null ? console.error("no such div id and className") : divTag;

  function aTagDownload(tag) {
    const dataURL = tag.toDataURL(1.0);
    const aTag = document.createElement("a");
    aTag.download = downloadFileName;
    aTag.href = dataURL;
    aTag.click();
  }
  try {
    const canvasTag = divTag.getElementsByTagName("canvas")[0];
    aTagDownload(canvasTag);
    return;
  } catch (e) {
    console.error(e);
  }
  html2canvas(divTag).then(function (canvas) {
    aTagDownload(canvas);
  });
};

/**
 * 파일 다운로드
 * @param  dataSource array of JSON data
 * @param  fileName 파일명
 * @param  fileExtension 확장자명(xlsx, txt, csv, html, rtf, xlsm, xlsb 등 가능)
 * 사용 예시: SociogranLight 278 line
 * SheetNames 수정 시 데이터 안들어감
 */

export const fileDownload = (
  dataSource,
  fileName = "제목없음",
  fileExtension = "xlsx"
) => {
  if (!dataSource || !Array.isArray(dataSource))
    return console.error("invalid data");

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const ws = XLSX.utils.json_to_sheet(dataSource);

  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, {
    bookType: fileExtension,
    type: "array",
  });
  const data = new Blob([excelBuffer], { type: fileType });
  try {
    saveAs(data, `${fileName}.${fileExtension}`);
  } catch (e) {
    console.error("saveAs");
  }
};

/**
 * 소시오그램 이미지 Download Handler
 * div 태그의 id 값을 받아 canvas 태그 추출
 */
export const sociogramImageDownload = (id) => {
  const divTag = document.getElementById(id);
  const canvasTag = divTag.getElementsByTagName("canvas")[0];
  let downloadFileName = divTag.innerText.replace(")", "").trim();
  const dataURL = canvasTag.toDataURL("1.0");

  if (id === "mainBottomRight") {
    downloadFileName = "플레이어 네트워크";
  }

  let aTag = document.createElement("a");
  aTag.download = downloadFileName
    ? `${downloadFileName}_sociogram`
    : `sociogram`;
  aTag.href = dataURL;
  aTag.click();
};

/**
 * 시각화 차트 Open Handler
 */
export const openChartPopup = () => {
  const opener = window.open(
    window.location.protocol +
      "//" +
      window.location.hostname +
      ":" +
      window.location.port +
      "/chart",

    "LIMENET_CHART_WINDOW",

    "width=1860" +
      ", height=" +
      window.screen.height +
      ",directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no"
  );

  if (isPopupBloock(opener)) {
    alert("팝업 차단 설정이 되어있습니다.");
    opener.close();
    return;
  }

  let timer = setInterval(function () {
    if (opener.closed) {
      clearInterval(timer);
      window.localStorage.removeItem("fullQuery");
      window.localStorage.removeItem("docList");
      window.localStorage.removeItem("selectedDocList");
    }
  }, 1000);

  // if (opener) {
  //   return opener;
  // }
};

const isPopupBloock = (opener) => {
  if (!opener || opener.closed || typeof opener.closed == "undefined")
    return true;
  return false;
};

export const getSnaColor = (size) => {
  let returnColor = "";

  switch (size) {
    // case 1:
    //   returnColor = "#D4BBFF";
    //   break;
    // case 2:
    //   returnColor = "#FFB3B8";
    //   break;
    case 1:
      returnColor = "#FFB37B";
      break;
    case 2:
      returnColor = "#95E27B";
      break;
    case 3:
      returnColor = "#30C862";
      break;
    case 4:
      returnColor = "#08BDBA";
      break;
    case 5:
      returnColor = "#087E8B";
      break;
    case 6:
      returnColor = "#0A84FF";
      break;
    case 7:
      returnColor = "#0043CE";
      break;
    // case size >= 10:
    //   returnColor = "#121A4C";
    //   break;
    default:
      returnColor = "#121A4C";
      break;
    // 링크색 더 얇게
  }
  return returnColor;
};

// Array 중복 제거(Object 속성이 1개일 때만 사용 가능)
export const oneAttrArrDeduplication = (data, newData) => {
  let duplicatedArray;
  newData.length ? duplicatedArray = [...data, ...newData] : duplicatedArray = [...data, newData]
  const set = new Set(duplicatedArray);
  const uniqueArr = [...set]
  return uniqueArr;
};

// Array 중복 제거(Object 속성이 여러 개일 때도 사용 가능, 중복 id값 삭제)
export const MultiAttrArrDeduplication = (data, newData) => {
  let duplicatedArray;
  newData.length ? duplicatedArray = [...data, ...newData] : duplicatedArray = [...data, newData]
  const uniqueArr = duplicatedArray.filter((item, i) => {
    return (
      duplicatedArray.findIndex((item2, ij) => {
        return item.id === item2.id;
      }) === i
    )
  })
  return uniqueArr;
}
