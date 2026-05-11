export const DEBUG = process.env.NODE_ENV === "development";

/**
 * Redux HTTP 통신 에러메세지
 * @type {{"401": string, "500": string, "403": string, "404": string}}
 */
export const HTTP_ERROR_MSG = {
  401: "로그인이 필요한 작업입니다.",
  401_1 : "ID 또는 비밀번호를 확인해주세요.",
  403: "권한이 존재하지 않습니다.",
  404: "해당 작업을 찾을 수 없습니다.",
  500: "서버 오류가 발생하였습니다.",
  467 : "접근허용된 관리자 IP가 아닙니다.",
};

/**
 * Limenet 에러메세지
 */
export const LIME_MSG = {
  DELETE: "삭제 하시겠습니까?",
  INSERT: "추가 하시겠습니까?",
  UPDATE: "수정 하시겠습니까?",
  UPDATE_SUCCESS: "수정되었습니다.",
  UPDATE_ERROR: "수정에 실패하였습니다.",
  DELETE_SUCCESS: "삭제되었습니다.",
  DELETE_ERROR: "삭제에 실패하였습니다.",
  ACCESS_ERROR: "잘못된 접근입니다.",
  INSERT_SUCCESS: "저장되었습니다.",
  INSERT_ERROR: "저장에 실패하였습니다. 다시 시도해주세요.",
  RESULT_ERROR: "검색 결과가 존재하지 않습니다.",
};

/**
 * Limenet 토픽 정보 메시지
 */
export const LIME_MSG_TOPIC = {
  PRO_BOOKMARK: "해당 전문가 토픽을 북마크 하시겠습니까?",
  PRO_BOOKMARK_WARN: "선택된 전문가 토픽이 존재하지 않습니다.",
  OPEN_BOOKMARK: "해당 공개 토픽을 북마크 하시겠습니까?",
  OPEN_BOOKMARK_WARN: "선택된 공개 토픽이 존재하지 않습니다.",
  TOPIC_SAVE: "현재 토픽을 저장하시겠습니까?",
  TOPIC_SAVE_WARN: "저장할 토픽이 존재하지 않습니다.",
  TOPIC_KEYWORD_WARN: "검색할 키워드가 존재하지 않습니다.",
  TOPIC_CATEGORY_WARN: "지정된 카테고리가 존재하지 않습니다.",
  TOPIC_LOAD: "선택된 토픽을 불러오시겠습니까?",
  TOPIC_LOADING: "토픽 모델을 새로 불러오는 중입니다...",
  TOPIC_LOAD_WARN: "선택된 토픽이 존재하지 않습니다.",
  TOPIC_SEARCH:
    "생성된 검색식으로 과제를 검색하시겠습니까? 저장되지 않은 토픽은 소실될 수 있습니다.",
  TOPIC_SEARCH_WARN: "검색식을 생성하고 실행해주세요.",
  TOPIC_RESET: "토픽을 초기화 하시겟습니까?",
  TOPIC_RESET_WARN: "초기화 할 토픽이 존재하지 않습니다.",
  LOAD_SUCCESS: "불러오기 성공",
  TOPIC_DATA_EXIST: "이미 존재하는 데이터입니다.",
  TOPIC_NAME_EXIST: "이미 존재하는 명칭입니다.",
  TOPIC_SIZE_WARN:"노드 수 생성 제한(300)",
  TOPIC_ID_ERR:"토픽 자동추가에 실패 하였습니다(ID 오류).",
  WORD_CLOUD_HELP:"토픽명과 연관된 과제 문서에서 출연 빈도가 높은 용어를 큰 글씨로 표시합니다.",
  SNA_HELP:"토픽명과 연관된 용어간의 의미관계를 나타내는 지식기반(knowledge base) 네트워크입니다.",
  TOPIC_NOT_EXIST_DES:"토픽 설명이 입력되지 않았습니다.",
  TOPIC_WORD_AUTO_CREATE:"단어를 자동 생성하는 중입니다...",
  TOPIC_CATEGORY_AUTO_CREATE:"토픽 모델에 맞는 카테고리를 자동 생성 중입니다...",
  TOPIC_NOT_SELECT:"토픽을 한 개 이상 선택해야 합니다.",
  WORD_ADD_SUCCESS:"해당 단어가 선택 목록에 추가되었습니다."
};

export const SNA_TYPE = {
  PAPER: "paper",
  WORD: "word",
  PLAYER: "player",
};

export const FILTER_ACTION = {
  INSERT: "insert",
  DELETE: "delete",
};

/**
 * 소시오그램 그래프 TYPE
 * SINGLE_DIMENSIONAL : 일차원
 * MULTI_DIMENSIONAL : 다차원
 * @type {{MULTI_DIMENSIONAL: string, SINGLE_DIMENSIONAL: string}}
 */
export const GRAPH_TYPE = {
  SINGLE_DIMENSIONAL: "single",
  MULTI_DIMENSIONAL: "multi",
};

export const ORDERING = {
  DEFAULT: "default",
  ASC: "ascending",
  DESC: "descending",
};

export const GRAPH_TITLE_MODE = {
  CLUSTERING: "clustering",
  AUTO_SCALE: "autoScale",
  FIX: "fix",
};

export const GRAPH_KEYWORD_TYPE = {
  WORD: "word",
  DOCUMENT: "document",
};

export const SEARCH_TYPE = {
  KEYWORD: "keyword",
  SUBJECT: "subject",
  SUBJECT_MULTI: "subjectm",
  TOPIC: "topic",
};

export const ROLE = {
  ROLE_ADMIN: 1, // 관리자 권한
  ROLE_USER: 2, // 일반 사용자 권한
  ROLE_EXPERT: 3, // 간사 권한
  ROLE_DOWNLOAD: 4, // 다운로드 권한
  ROLE_CHARGER: 5, // 담당자 권한
}

/**
 * EXCEL UPLOAD 관련 상수
 */

export const EXCEL_UPLOAD_TYPE = {
  STRING: "string",
  INTEGER: "integer",
  DATE: "date",
};
export const EXCEL_UPLOAD_REQUIRED = {
  TRUE: true,
  FALSE: false,
};
export const EXCEL_UPLOAD_ERROR = {
  COLUMN_COUNT:
    "엑셀파일의 가로(열) 갯수와 샘플 파일의 가로(열) 갯수가 다릅니다.",
  NOT_NULL: "항목이 누락되었습니다.",
  INTEGER_TYPE: "숫자 항목의 형식이 잘못되었습니다.",
  DATE_TYPE: "날짜 항목에 오류가 있습니다.",
  STRING_LENGTH: "문자열이 허용 길이를 초과 하였습니다.",
  INTEGER_SIZE: "숫자 항목이 허용 범위를 초과 하였습니다.",
  ALLOWED_CODE: "코드 항목에 허용되지않은 데이터가 있습니다.",
};

/**
 * 구버전 자료
 * @type {{PUBLISHER: string, PD_ISSUE: string, ORGN_KEIT: string, SUBJECT_NTIS: string, THESIS_NDSL: string, ORGN_KEIT_ANAL: string, PLAYER: string, RECO_TAB_LIST: [{ko: string, type: string, key: string}, {ko: string, type: string, key: string}, {ko: string, type: string, key: string}, {ko: string, type: string, key: string}, {ko: string, type: string, key: string}, null], POLICY: string, THESIS_KEIT: string, PATENT: string, BOOK: string, ORGN_NTIS: string, THESIS_SBJT: string, MBR: string, SUBJECT_KEIT: string, properties: {sbjt_thes: {name: string, value: string}, "crawl-keit-pdreport": {name: string, value: string}, patent: {name: string, value: string}, book: {name: string, value: string}, sbjt: {name: string, value: string}, thesis: {name: string, value: string}, mbr_thes: {name: string, value: string}, n_orgn: {name: string, value: string}, "crawl-*": {name: string, value: string}, mbr: {name: string, value: string}, sbjt_n: {name: string, value: string}, orgn: {name: string, value: string}, player: {name: string, value: string}}}}
 */

//Field Type
export const FIELD_TYPE = {
  PATENT: "patent",
  THESIS_NDSL: "thesis",
  THESIS_KEIT: "mbr_thes",
  THESIS_SBJT: "sbjt_thes",
  MBR: "mbr",
  SUBJECT_NTIS: "sbjt_n",
  SUBJECT_KEIT: "sbjt",
  ORGN_NTIS: "n_orgn",
  ORGN_KEIT: "orgn",
  ORGN_KEIT_ANAL: "orgn_anal",
  PD_ISSUE: "crawl-keit-pdreport",
  POLICY: "crawl-*",
  PUBLISHER: "publisher",
  PLAYER: "player",
  BOOK: "book",
  properties: {
    patent: { name: "출원 특허", value: "patent" },
    thesis: { name: "논문", value: "thesis" },
    mbr_thes: { name: "KEIT논문", value: "mbr_thes" },
    sbjt_thes: { name: "KEIT논문", value: "sbjt_thes" },
    mbr: { name: "KEIT연구자", value: "mbr" },
    sbjt_n: { name: "국가R&D과제", value: "sbjt_n" },
    sbjt: { name: "KEIT R&D 과제", value: "sbjt" },
    n_orgn: { name: "국가 R&D 기관", value: "n_orgn" },
    orgn: { name: "KEIT R&D 기관", value: "orgn" },
    "crawl-keit-pdreport": {
      name: "PD 이슈리포트",
      value: "crawl-keit-pdreport",
    },
    "crawl-*": { name: "정책보고서", value: "crawl-*" },

    player: { name: "플레이어", value: "player" },
    book: { name: "도서", value: "book" },
  },

  RECO_TAB_LIST: [
    { key: "PATENT", ko: "출원 특허", type: "patent" },
    { key: "THESIS_NDSL", ko: "논문", type: "thesis" },
    { key: "SUBJECT_NTIS", ko: "국가 R&D 과제", type: "sbjt_n" },
    { key: "SUBJECT_KEIT", ko: "R&D", type: "sbjt" },
    { key: "MBR", ko: "연구자", type: "mbr" },
    { key: "PD_ISSUE", ko: "PD 이슈리포트", type: "crawl-keit-pdreport" },
  ],
};

export const FONT_FAMILY_STRING =
  "'Noto Sans Korean', 'Malgun Gothic', Dotum ,Helvetica,AppleSDGothicNeo,sans-serif";

export const ASSIGN_TYPE = {
  RE_ASSIGN : "reassign",
  ASSIGN : "assign"
}