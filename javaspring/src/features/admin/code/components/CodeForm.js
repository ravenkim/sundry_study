import React, { useEffect, useState } from "react";
import {notification} from "antd";

const CodeForm = ({
  initialValues,
  submitHandler,
  deleteHandler,
  updateHandler,
}) => {
  const formDataFrame = {
    commCd: null,
    commCdNm: null,
    etcRmkCn1: null,
    etcRmkCn2: null,
    etcRmkCn3: null,
    commCdSortSn: null,
    useYn: null,
    delYn: null,
    lastModfDt: null,
    lastModfMemberId: null,
    frstRegDt: null,
    frstRegMemberId: null,
    hirkCommCd: null
  }
  const [formData, setFormData] = useState(formDataFrame);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (initialValues) {
      setChecked(initialValues.useYn === "Y");
      setFormData(initialValues);
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [initialValues]);

  const [checked, setChecked] = useState();

  const radioCheckHandler = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      useYn: value
    }))
    setChecked(value === "Y")
  };

  const wordChangeHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name] : e.target.value
    }));
  };

  const openNotification = (type, msg, desc) => {
    notification[type]({
      message: msg,
      description: desc,
      placement: "bottomRight"
    })
  };

  return (
    <form id={"codeForm"}>
      <div className="flex-row gap-16 mb-16 items-center">
        <h4>코드 그룹 추가</h4>
        <button
          type="button"
          className="btn-system-red-32 ml-auto plr-40"
          onClick={() => deleteHandler(formData.commCd)}
          disabled={!formData.commCd}
        >삭제하기</button>
        {formData.commCd ?
          <button
            type="button"
            className="btn-primary-32 plr-40"
            onClick={() => {
              formData.commCdNm ? updateHandler(formData) : openNotification("error", "필수 항목을 입력해주세요.");
            }}
            disabled={!formData.hirkCommCd}
          >수정하기</button>
          :
          <button
            type="button"
            className="btn-primary-32 plr-40"
            onClick={() => {
              formData.commCdNm ? submitHandler(formData) : openNotification("error", "필수 항목을 입력해주세요.");
            }}
            disabled={!formData.hirkCommCd}
          >저장하기</button>

        }
      </div>

      <div className="grid-col-2 gap-16">
        <div>
          <div className="form-label-text">상위공통코드</div>
          <input
            type="text"
            className="mtb-8"
            value={formData.hirkCommCd ? formData.hirkCommCd : ""}
            disabled
          />
        </div>
        <div>
          <div className="form-label-text">공통코드</div>
          <input
            type="text"
            className="mtb-8"
            value={formData.commCd ? formData.commCd : ""}
            disabled
          />
        </div>
        <div>
          <div className="form-label-text">코드명<p className="text-red">필수</p></div>
          <input
            type="text"
            className="mt-8"
            placeholder={"코드명을 입력하세요."}
            value={formData.commCdNm ? formData.commCdNm : ""}
            name={"commCdNm"}
            onChange={(e) => wordChangeHandler(e)}
            required
            maxLength={30}
            disabled={!formData.hirkCommCd}
          />
        </div>
        <div>
          <div className="form-label-text">정렬순서</div>
          <input
            type="number"
            min={0}
            className="mt-8"
            placeholder={""}
            value={formData.commCdSortSn ? formData.commCdSortSn : ""}
            name={"commCdSortSn"}
            onChange={(e) => wordChangeHandler(e)}
            maxLength={10}
            disabled={!formData.hirkCommCd}
          />
        </div>
      </div>
      <div className="form-label-text mt-40">기타 1</div>
      <input
        type="text"
        className="mt-8 mb-16"
        placeholder={"기타 1"}
        value={formData.etcRmkCn1 ? formData.etcRmkCn1 : ""}
        name={"etcRmkCn1"}
        onChange={(e) => wordChangeHandler(e)}
        maxLength={100}
        disabled={!formData.hirkCommCd}
      />
      <div className="form-label-text">기타 2</div>
      <input
        type="text"
        className="mt-8 mb-16"
        placeholder={"기타 2"}
        value={formData.etcRmkCn2 ? formData.etcRmkCn2 : ""}
        name={"etcRmkCn2"}
        onChange={(e) => wordChangeHandler(e)}
        maxLength={100}
        disabled={!formData.hirkCommCd}
      />
      <div className="form-label-text">기타 3</div>
      <input
        type="text"
        className="mt-8"
        placeholder={"기타 3"}
        value={formData.etcRmkCn3 ? formData.etcRmkCn3 : ""}
        name={"etcRmkCn3"}
        onChange={(e) => wordChangeHandler(e)}
        maxLength={100}
        disabled={!formData.hirkCommCd}
      />

      <div className="grid-col-2 mt-24">
        <div className="flex-row">
          <div className="form-label-text">사용여부</div>
          <div className="radio-box-type ml-auto flex-row gap-16">
            <input
              type="radio"
              name="group"
              value={"Y"}
              id="radio-box-type-1"
              checked={checked}
              disabled={disabled}
              onChange={() => radioCheckHandler("Y")}
              disabled={!formData.hirkCommCd}
            />
            <label htmlFor="radio-box-type-1">사용</label>
            <input
              type="radio"
              name="group"
              value={"N"}
              id="radio-box-type-2"
              checked={!checked}
              disabled={disabled}
              onChange={() => radioCheckHandler("N")}
              disabled={!formData.hirkCommCd}
            />
            <label htmlFor="radio-box-type-2">미사용</label>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CodeForm;
