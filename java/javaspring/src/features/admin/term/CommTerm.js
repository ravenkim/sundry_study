import React, { useEffect, useState } from "react";
import { Modal, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";

import TermSelect from "features/admin/term/components/TermSelect";
import TermTable from "./components/TermTable";
import { termAction } from "features/admin/term/termReducer";
import { deleteTerm, insertTerm, multiDeleteTerm } from "./termAPI";

import TermForm from "./components/TermForm";
import { MultiAttrArrDeduplication } from "utils/commonUtils"
/*
20220607
용어 list GET 시, tipa_mbr db
POST, DELETE 시, tipa_mbr, tipa_sbjt db 동시에 적용
* */
const typeData = [
  {
    id: 1,
    key: "compound",
    value: "복합어",
  },{
    id: 2,
    key: "edgelist_term",
    value: "분석대상용어",
  },{
    id: 3,
    key: "representative",
    value: "대표어",
  },{
    id: 4,
    key: "synonym",
    value: "동의어",
  },{
    id: 5,
    key: "stopword",
    value: "불용어",
  },{
    id: 6,
    key: "terminology",
    value: "명사",
  }
];

const CommTerm = () => {
  const dispatch = useDispatch();
  
  const { termList, termListError } = useSelector(
    ({ termReducer }) => ({
      termList: termReducer.termList,

    })
  );

  useEffect(() => {
    dispatch(termAction.getTerm({ target: "termList" }));
  }, []);

  const [totalPages, setTotalPages] = useState();
  const [totalCount, setTotalCount] = useState();
  useEffect(() => {
    if (termList.error) {
      Modal.error({
        title: "오류 발생",
        content: termList.errorMessage,
        okText: "확인",
      });
    }
    if (termList.data) {
      setTotalPages(termList.data.totalPages);
      setTotalCount(termList.data.count);
    }
  }, [termList]);



  const [selectedTypeData, setSelectedTypeData] = useState("compound");
  const typeHandler = (data) => {
    setSelectedTypeData(data);
  };

  const [selectedRow, setSelectedRow] = useState([]);
  const selectAllHandler = (rows) => {
    const selectedRowKeys = selectedRow.map((row) => row.id);
    const insertCheckArr = rows.map((row) => {
      if (selectedRowKeys.includes(row.id)) {
        return true
      } else {
        return false
      }
    });
    const insertCheck = insertCheckArr.filter((data) => data !== false);
    if (insertCheck.length === 30) {
      const deleteKeys = rows.map((row) => row.id);
      const deletedArr = selectedRow.filter((row) => !deleteKeys.includes(row.id));
      setSelectedRow(deletedArr);
    } else {
      const uniqueArr = MultiAttrArrDeduplication(selectedRow, rows);
      setSelectedRow(uniqueArr);
    }
  };
  const selectChangeHandler = (row) => {
    const selectedRowKeys = selectedRow.map((data) => data.id);
    selectedRowKeys.includes(row.id) ? setSelectedRow(selectedRow.filter((data) => data.id !== row.id)) : setSelectedRow([...selectedRow, row])
  };
  const selectCancelHandler = () => {
    setSelectedRow([]);
  };

  const [selectedPage, setSelectedPage] = useState(1);
  const pageHandler = (page) => {
    if (page <= 0) {
      openNotification("warning", "첫 페이지입니다.");
    } else if (page >= totalPages+1) {
      openNotification("warning", "마지막 페이지입니다.");
    } else {
      setSelectedPage(page);
      dispatch(termAction.getTerm({target: "termList", typeKey: selectedTypeData, keyword: searchKeyword, page: page}));
    }
  };

  const [title, setTitle] = useState("복합어");
  const [radioKey, setRadioKey] = useState("compound")
  const [searchKeyword, setSearchKeyword] = useState("")
  const searchHandler = (value) => {
    setSearchKeyword(value);
    setSelectedPage(1);
    if (selectedTypeData) {
      dispatch(termAction.getTerm({target: "termList", typeKey: selectedTypeData, keyword: value, page: 1}))
    }
    setSelectedRow([]);
    const title = typeData[typeData.findIndex((data) => data.key === selectedTypeData)].value
    setTitle(title);
    setRadioKey(selectedTypeData);
  };

  const openNotification = (type, msg, desc) => {
    notification[type]({
      message: msg,
      description: desc,
      placement: "bottomRight"
    })
  };
  const termSubmitHandler = (formData) => {
    const typeKey = typeData.map(data => data.key);

    if (!typeKey.includes(formData.termType)) {
      return openNotification("error", "용어 타입을 선택해주세요.");
    }

    if (!formData.term1) {
      return openNotification("error", "용어를 입력해주세요.");
    }
    if (["compound","representative","synonym"].includes(formData.termType) && !formData.term2) {
      return openNotification("error", "용어를 입력해주세요.");
    }

    if (formData.term2 === "") {
      formData.term2 = undefined;
    }
    
    try {
      insertTerm(formData).then(() => {
        dispatch(termAction.getTerm({target: "termList", typeKey: selectedTypeData, keyword: searchKeyword, page: selectedPage}));
        closeModal();
      });
    } catch(e) {
      console.error(e);
      openNotification("error", "용어 추가에 실패하였습니다.");
    }
  };

  const termMultiDeleteHandler = () => {
    if (selectedRow && selectedRow.length > 0) {
      const rowKeys = selectedRow.map((row) => row.id);
      Modal.confirm({
        title: "용어 선택 삭제",
        content: `${selectedRow.length}개의 용어를 모두 삭제하시겠습니까?`,
        okText: "확인",
        cancelText: "취소",
        onOk: () => {
          try {
            multiDeleteTerm({target: "multiDeleteTerm", typeKey: selectedTypeData, checkList: rowKeys})
              .then(() => {
                dispatch(termAction.getTerm({target: "termList", typeKey: selectedTypeData, keyword: searchKeyword}))
                setSelectedPage(1);
                setSelectedRow([]);
              });
          } catch(e) {
            console.error(e);
            openNotification("error", "검증에 실패하였습니다.");
          }
        },
      });
    } else {
      openNotification("error", "선택한 용어가 없습니다.")
    }
  };

  const termDeleteHandler = (key) => {
    Modal.confirm({
      title: "용어 삭제",
      content:
        "해당 용어를 삭제하시겠습니까?",
      okText: "확인",
      cancelText: "취소",
      onOk: () => {
        try {
          deleteTerm({target: "deleteTerm", typeKey: selectedTypeData, termKey: key})
          .then(() => {
            dispatch(termAction.getTerm({target: "termList", typeKey: selectedTypeData, keyword: searchKeyword, page: selectedPage}));
            setSelectedRow(selectedRow.filter((row) => row.id !== key));
          });
        } catch(e) {
          console.error(e);
          openNotification("error", "검증에 실패하였습니다.");
        }
      },
    });
  };

  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
    setRadioKey(selectedTypeData);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
      // <div className="grid-col-full main-height-large relative">
        <div className="grid-left relative">
          <TermSelect
            typeData={typeData}
            typeHandler={typeHandler}
            searchHandler={searchHandler}
            showModal={showModal}
          />
          {modalVisible &&
            <TermForm
              typeData={typeData}
              submitHandler={termSubmitHandler}
              closeModal={closeModal}
              radioKey={radioKey}
              selectedRow={selectedRow}
            />
          }
          <TermTable
            initialValues={termList.data}
            termType={selectedTypeData}
            title={title}
            pageHandler={pageHandler}
            selectedPage={selectedPage}
            totalPages={totalPages}
            totalCount={totalCount}
            selectedRow={selectedRow}
            selectAllHandler={selectAllHandler}
            selectChangeHandler={selectChangeHandler}
            selectCancelHandler={selectCancelHandler}
            termDeleteHandler={termDeleteHandler}
            termMultiDeleteHandler={termMultiDeleteHandler}
          />
        </div>
      // </div>
  );
};

export default CommTerm;
