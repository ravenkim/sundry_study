/**
 * 성능지표 관련 공통 코드 값 설정
 *
 */


export const PRODUCT_CODE = {
  PRODUCT : {
    code : 1,
    text : "제품"
  }
}


export const PRODUCT_PI_CODE = {
  VALUE : {
    code : "value",
    text : "값"
  },
  RANGE :  {
    code : "range",
    text : "범위"
  }
}



export const UNIT_OPERATOR_CODE = {
  PLUS :  {
    code : "+",
    text : "더하기"
  },
  MINUS : {
    code : "-",
    text : "빼기"
  },
  MUL : {
    code : "·",
    text : "곱하기"
  },
  DIV : {
    code : "/",
    text : "나누기"
  },
}

export const OPERATOR_CODE = {
  PLUS :  {
    code : "+",
    text : "더하기",
    type : ["value"] // "value" "range"
  },
  MINUS : {
    code : "-",
    text : "빼기",
    type : ["value"]
  },
  PLUS_MINUS :{
    code : "±",
    text : "근사값",
    type : ["value"]
  },
  EXCESS : {
    code : "<",
    text : "초과",
    type : ["value"]
  },
  UNDER : {
    code : ">",
    text : "미만",
    type : ["value"]
  },
  MORE : {
    code : "< =",
    text : "이상",
    type : ["value"]
  },
  LESS : {
    code : "> =",
    text : "이하",
    type : ["value"]
  },
  BETWEEN : {
    code : "between",
    text : "사이",
    type : ["range"]
  },
  NOT_BETWEEN : {
    code : "not between",
    text : "사이 제외",
    type : ["range"]
  }
}
export const getUnitOperatorList = () =>  Object.values(UNIT_OPERATOR_CODE)

export const getOperatorList = (type="value") =>  Object.values(OPERATOR_CODE).filter(item=>item.type.includes(type))

export const getConfirmList = () =>  Object.values(CONFIRM_STATE_CODE)

export const convertConfirmNm = (value) => {
  switch (value){
    case CONFIRM_STATE_CODE.INIT.code:
      return CONFIRM_STATE_CODE.INIT.text
    case CONFIRM_STATE_CODE.COMP.code:
      return CONFIRM_STATE_CODE.COMP.text
    case CONFIRM_STATE_CODE.REJECT.code:
      return CONFIRM_STATE_CODE.REJECT.text
    default:
      return "코드 없음"
  }
}


export const CONFIRM_STATE_CODE = {
  NONE : {
    code : "none",
    text : "조건 없음"
  },
  INIT : {
    code : "init",
    text : "승인대기"
  },
  COMP : {
    code : "comp",
    text : "승인"
  },
  REJECT : {
    code : "reject",
    text : "반려"
  },
}

export const INPUT_SOURCE_CODE = {
  INPUT : {
    code : "input",
    text : "기본입력"
  },
  EXCEL : {
    code : "excel",
    text : "엑셀"
  }
}

export const UNIT_STATE_CODE = {
  CREATE : {
    code : "unit_create",
    text : "등록하기"
  },
  MODIFY : {
    code : "unit_modify",
    text : "수정하기"
  },
  NONE : {
    code : "unit_none",
    text : "불가상태"
  }
}

export const UNIT_TYPE_CODE = {
  US : {
    code : "us",
    text : "단위 선택"
  },
  UC : {
    code : "uc",
    text : "단위 조합"
  }
}

