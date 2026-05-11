import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";

import CodeTreeList from "./components/CodeTreeList";
import CodeForm from "./components/CodeForm";
import { codeAction } from "features/admin/code/codeReducer";
import { deleteCode, insertCode, updateCode } from "./codeAPI";

const CommCode = () => {
  const dispatch = useDispatch();

  const { codeList, codeListError, codeDetail, codeDetailError } = useSelector(
    ({ codeReducer }) => ({
      codeList: codeReducer.codeList,
      codeDetail: codeReducer.codeDetail,
    })
  );

  useEffect(() => {
    dispatch(codeAction.getCodeList({ target: "codeList" }));
  }, []);

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (codeDetail.data) {
      setInitialValues(codeDetail.data);
    }
  },[codeDetail.data])

  const [selectedKeys, setSelectedKeys] = useState();
  const codeSelectHandler = (keys) => {
    setSelectedKeys(keys);
    if (keys && keys.length > 0) {
      dispatch(codeAction.getCode({ target: "codeDetail", codeKey: keys[0] }));
    }
  };

  const codeSubmitHandler = (formData) => {
    Modal.confirm({
      title: "코드 추가",
      content: "해당 코드를 추가하시겠습니까?",
      okText: "확인",
      cancelText: "취소",
      onOk: () => {
        try {
          insertCode(formData).then(() => {
            dispatch(codeAction.getCodeList({ target: "codeList" }));
          });
        } catch(e) {
          console.error(e);
        }
      },
    })
  };

  const codeDeleteHandler = (codeKey) => {
    Modal.confirm({
      title: "코드 삭제",
      content:
        "해당 코드를 삭제하시겠습니까? (하위 코드가 있으면 함께 삭제됩니다.)",
      okText: "확인",
      cancelText: "취소",
      onOk: () => {
        try {
          deleteCode(codeKey).then(() => {
            dispatch(codeAction.getCodeList({ target: "codeList" }));
            formResetHandler()
          });
        } catch(e) {
          console.error(e);
        }
      },
    });
  };

  const codeUpdateHandler = (formData) => {
    Modal.confirm({
      title: "코드 수정",
      content: "해당 코드를 수정하시겠습니까?",
      onText: "확인",
      cancelText: "취소",
      onOk: () => {
        try {
          updateCode(formData).then(() => {
            dispatch(codeAction.getCodeList({ target: "codeList" }));
            });
        } catch(e) {
          console.error(e);
        }
      },
    });
  };

  useEffect(() => {
    if (codeList.error) {
      Modal.error({
        title: "오류 발생",
        content: codeList.errorMessage,
        okText: "확인",
      });
      // alert(codeList.errorMessage);
    }
  }, [codeList]);

  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    if (initialValues) {
      initialValues.commCd ? setButtonDisabled(false) : setButtonDisabled(true);
    }
  },[initialValues])

  const formResetHandler = () => {
    const keys = Object.keys(initialValues);
    keys.map((key) => {
      setInitialValues((prevState) => ({
        ...prevState,
        [key]: null
      }))
    });
  };

  const addCodeGroupHandler = () => {
    setButtonDisabled(true);
    formResetHandler();
    setInitialValues((prevState) => ({
      ...prevState,
      hirkCommCd: "CL000000000",
      useYn: "Y",
      delYn: "N",
    }));
  };

  const addCodeHandler = () => {
    const commCd = initialValues.commCd;
    formResetHandler();
    setInitialValues((prevState) => ({
      ...prevState,
      hirkCommCd: commCd,
      useYn: "Y",
      delYn: "N",
    }));
  };


  return (
    <main className="grid-col-full">
      <div className="grid-col-5 gap-16 main-height-large relative">
        <div className="grid-left col-span-2 p-16">
          <div className="flex-row gap-16 mb-16 items-center">
            <h4>코드 목록</h4>
            <button
              type="button"
              className="btn-secondary-32 ml-auto"
              onClick={() => addCodeGroupHandler()}
            >코드 그룹 추가</button>
            <button
              type="button"
              className="btn-tertiary-32"
              onClick={() => addCodeHandler()}
              disabled={buttonDisabled}
            >하위 코드 추가</button>
          </div>
            <CodeTreeList
              dataSource={codeList.data}
              selectedKeys={selectedKeys}
              codeSelectHandler={codeSelectHandler}
            />
        </div>
        <div className="grid-right col-span-3 p-16">
          <CodeForm
            initialValues={initialValues}
            submitHandler={codeSubmitHandler}
            deleteHandler={codeDeleteHandler}
            updateHandler={codeUpdateHandler}
          />

        </div>
      </div>
    </main>
  );
};

export default CommCode;
