import React, { useEffect, useState } from "react";
import {notification} from "antd";

const TermForm = (
  {
    typeData,
    submitHandler,
    closeModal,
    radioKey,
    selectedRow
  }) => {

  const [firstTerm, setFirstTerm] = useState("복합어");
  const [secondTerm, setSecondTerm] = useState("복합어의 구성 용어");
  const [secRequired, setSecRequired] = useState(true);
  const [radioValue, setRadioValue] = useState("compound");
  useEffect(() => {
    if (radioKey === "compound") {
      setFirstTerm("복합어");
      setSecondTerm("복합어의 구성 용어");
      setSecRequired(true);
      setRadioValue("compound");
      setTerm1("");
    } else if (radioKey === "edgelist_term") {
      setFirstTerm("용어");
      setSecRequired(false);
      setRadioValue("edgelist_term");
      setTerm1("");
    } else if (radioKey === "representative") {
      setFirstTerm("대표어");
      setSecondTerm("변환대상용어");
      setSecRequired(true);
      setRadioValue("representative");
      if (selectedRow.length > 0) {
        setTerm1(selectedRow[0].mainTerm);
      } else {
        setTerm1("");
      }
    } else if (radioKey === "synonym") {
      setFirstTerm("용어");
      setSecondTerm("동의어");
      setSecRequired(true);
      setRadioValue("synonym");
      if (selectedRow.length > 0) {
        setTerm1(selectedRow[0].mainTerm);
      } else {
        setTerm1("");
      }
    } else if (radioKey === "stopword") {
      setFirstTerm("용어");
      setSecRequired(false);
      setRadioValue("stopword")
      setTerm1("");
    } else if (radioKey === "terminology") {
      setFirstTerm("용어");
      setSecRequired(false);
      setRadioValue("terminology");
      setTerm1("");
    }
  },[radioKey, selectedRow]);


  const valueChangeHandler = (value) => {
    setRadioValue(value);
    switch (value) {
      default:
        setFirstTerm("복합어");
        setSecondTerm("복합어의 구성 용어");
        setSecRequired(true);
        break;
      case "compound":
        setFirstTerm("복합어");
        setSecondTerm("복합어의 구성 용어");
        setSecRequired(true);
        break;
      case "synonym":
        setFirstTerm("용어");
        setSecondTerm("동의어");
        setSecRequired(true);
        break;
      case "representative":
        setFirstTerm("대표어");
        setSecondTerm("변환대상용어");
        setSecRequired(true);
        break;
      case "edgelist_term":
        setFirstTerm("용어");
        setSecRequired(false);
        break;
      case "stopword":
        setFirstTerm("용어");
        setSecRequired(false);
        break;
      case "terminology":
        setFirstTerm("용어");
        setSecRequired(false);
        break;
    }
  };

  const [term1, setTerm1] = useState('');
  const [term2, setTerm2] = useState('');

  const wordChangeHandler = (e) => {
    e.target.name === "term1" ? setTerm1(e.target.value) : setTerm2(e.target.value);
  };

  const onPressEnter = (e) => {
    if (e.key === "Enter") {
      submitHandler({
        termType: radioValue,
        term1: term1,
        term2: term2
      });
    }
  };

  const openNotification = (type, msg, desc) => {
    notification[type]({
      message: msg,
      description: desc,
      placement: "bottomRight"
    })
  };

  return (
    <>
      <div className="modal-pop show" id="modal-pop" style={{width: "876px", top: "114px", right: "16px"}}>
        <div className="flex-col gap-24">
          {/*타이틀*/}
          <div className="title">
            <h3>용어 추가</h3>
            <button type="button" className="close" onClick={closeModal}/>
          </div>
          {/*입력폼*/}
          <div className="grid-col-5 items-center">
            <div className="col-span-1">
              <div className="form-label-text">용어 타입 *</div>
            </div>
            <div className="col-span-4">
              <div className="radio-box-type flex-row gap-8">
                {typeData && typeData.map((data) => (
                  <>
                    <input
                      type="radio"
                      name="group"
                      value={data.key}
                      defaultChecked={radioKey === data.key}
                      id={`radio-box-type-${data.id}`}
                      onClick={() => valueChangeHandler(data.key)}
                    />
                    <label htmlFor={`radio-box-type-${data.id}`} className={`flex-${data.value === "분석대상용어" ? "0" : "1"}`}>{data.value}</label>
                  </>
                ))
                }
              </div>
            </div>
          </div>
          <div className="grid-col-5 items-center">
            <div className="col-span-1">
              <div className="form-label-text">{firstTerm} *</div>
            </div>
            <div className="col-span-4">
              <input
                type="text"
                value={term1}
                required={!term1}
                name={"term1"}
                onChange={(e) => wordChangeHandler(e)}
                onKeyPress={(e) => onPressEnter(e)}
                placeholder={radioValue !== "compound" ? `${firstTerm}를 입력하세요. 콤마로 분리하여 입력하면 여러개 ${firstTerm}를 입력 가능` : `${firstTerm}를 입력하세요.`}
              />
            </div>
          </div>
          {secRequired &&
            <div className="grid-col-5 items-center">
              <div className="col-span-1">
                <div className="form-label-text">{secondTerm} *</div>
              </div>
              <div className="col-span-4">
                <input
                  type="text"
                  value={term2}
                  required={!term2}
                  name={"term2"}
                  onChange={(e) => wordChangeHandler(e)}
                  onKeyPress={(e) => onPressEnter(e)}
                  placeholder={radioValue !== "compound" ? `${secondTerm}를 입력하세요. 콤마로 분리하여 입력하면 여러개 ${secondTerm}를 입력 가능` : `${secondTerm}를 입력하세요.`}
                />
              </div>
            </div>
          }
          {/*버튼*/}
          <button
            type="button"
            className="btn-primary-40 w-full"
            onClick={() =>
            {
              secRequired ?
              (term1 && term2 ? submitHandler({termType: radioValue, term1: term1, term2: term2}) : openNotification("error", "필수 항목을 입력해주세요."))
              :
              term1 ? submitHandler({termType: radioValue, term1: term1}) : openNotification("error", "필수 항목을 입력해주세요.")
            }
            }
          >추가하기
          </button>
        </div>
      </div>
    </>
  );
};

export default TermForm;
