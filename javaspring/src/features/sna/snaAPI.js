import client from "api/client";
import { FIELD_TYPE } from "Constants";

// issue list select
export const getIssueList = (paramObj) =>
  client.get(`/anal/get_issue_list`, {
    params: paramObj,
  });

// 소시오그램 data sleect
export const getWordSearch = (paramObj) =>
  client.get(`/anal/get_word_search`, {
    params: paramObj,
  });

export const getWordcountSearch = (paramObj) =>
  client.get(`/anal/get_wordcount_search`, {
    params: paramObj,
  });

export const getLimeWord = (paramObj) =>
        client.get(`/anal/get_lime_word`, {
          params: paramObj,
        });

export const getLimeWordAutocomplete = (paramObj) =>
        client.get(`/anal/get_lime_word_autocomplete`, {
          params: paramObj,
        });


export const getDetailData = (paramObj) => {
  let url = "";
  switch (paramObj.type) {
    case FIELD_TYPE.PATENT:
      url = `/anal/get_detail_patent`;
      break;
    case FIELD_TYPE.THESIS_NDSL:
      url = `/dt/search_es/get_detail_thesis_ndsl`;
      break;
    case FIELD_TYPE.SUBJECT_NTIS:
      url = `/dt/search_es/get_detail_subject_ntis`;
      break;
    case FIELD_TYPE.SUBJECT_KEIT:
      url = `/dt/search_es/get_detail_subject_keit`;
      break;
    case FIELD_TYPE.MBR:
      url = `/dt/search_es/get_detail_mbr`;
      break;
    case FIELD_TYPE.Player:
      url = `/dt/search_es/get_detail_patent`;
      break;
    case FIELD_TYPE.ORGN_KEIT:
      url = "/dt/search_es/get_detail_orgn";
      break;
    case FIELD_TYPE.ORGN_NTIS:
      url = "/dt/search_es/get_detail_n_orgn";
      break;
    case FIELD_TYPE.ORGN_KEIT_ANAL:
      url = "/dt/search_es/get_detail_keit_orgn";
      break;
    case FIELD_TYPE.BOOK:
      url = "/dt/search_es/get_detail_patent";
      break;

    default:
      url = "";
      break;
  }
  return client.get(url, {
    params: {
      keys: paramObj.keys,
    },
  });
};
