import React, { useEffect, useState }from 'react';

const CondForm = (
  {
    initialValues,
    insertFormVisible,
    condUpdateHandler,
    condInsertHandler,
    initialState,
    formDataLayout
  }) => {

  const [formData, setFormData] = useState(formDataLayout);
  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  },[initialValues])

  const wordChangeHandler = (e) => {
    const key = e.target.name.split('.');
    key.length === 2 ?
      setFormData((prevState) => ({
        ...prevState,
        [key[0]]: {
          ...prevState[key[0]],
          [key[1]] : e.target.value
        }
      }))
      :
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }))
  };

  const arrayChangeHandler = (e, value) => {
    const key = e.target.name;
    setFormData((prevState) => ({
      ...prevState,
      excludeCond: {
        ...prevState.excludeCond,
          [key]: formData.excludeCond[key].includes(...value) ? formData.excludeCond[key].filter((data) => !value.includes(data)) : [...formData.excludeCond[key], ...value]
      }
    }))
  };

  return (
    <form onSubmit={() => condInsertHandler(formData)}>
      <div className="grid-right p-0 pb-32">
          {insertFormVisible ?
            <h4 className="mt-24 mb-40 mlr-16">조건 추가</h4>
            :
            <div className="flex-row items-center mt-16 mlr-16 mb-40">
              <h4>조건 상세보기</h4>
              <button
                type="button"
                className="btn-primary-32 ml-auto"
                onClick={() => condUpdateHandler(formData)}
              >저장하기</button>
            </div>
          }
        <div className="pt-0 plr-40 overflow-auto" style={{height: insertFormVisible ?  'calc(100vh - 367px)' : 'calc(100vh - 317px)'}}>
          <h5>조건 명칭</h5>
          <input
            type="text"
            className="mt-8"
            placeholder="ex. 2022년 하반기 분과구성 기본 및 제척조건"
            value={formData.recoCondNm ? formData.recoCondNm : ""}
            onChange={(e) => wordChangeHandler(e)}
            name={"recoCondNm"}
            required
            maxLength={50}
          />
          <h5 className="mt-40 mb-16">분과 구성</h5>
          <div className="frame bg-gray-100 p-16 flex-col gap-16">
            <div className="grid-col-3 items-center">
              <div className="col-span-1">
                <div className="form-label-text">분과 별 과제 수</div>
              </div>
              <div/>
              <div className="col-span-1">
                <input
                  type="number"
                  min={0}
                  name={"subjectCnt"}
                  className="text-right w-full"
                  placeholder="숫자입력"
                  value={formData.subjectCnt ? formData.subjectCnt : ""}
                  onChange={(e) => wordChangeHandler(e)}
                  required
                  maxLength={11}
                />
              </div>
            </div>
            <div className="grid-col-3 items-center">
              <div className="col-span-1">
                <div className="form-label-text">배정 평가위원 수</div>
              </div>
              <div/>
              <div className="col-span-1">
                <input
                  type="number"
                  min={0}
                  name={"evlMbrCnt"}
                  className="text-right w-full"
                  placeholder="숫자입력"
                  value={formData.evlMbrCnt ? formData.evlMbrCnt : ""}
                  onChange={(e) => wordChangeHandler(e)}
                  required
                  maxLength={11}
                />
              </div>
            </div>
          </div>
          <h5 className="mt-40 mb-16">평가위원 구성</h5>
          <div className="drop-down-content">
            <div className="drop-down pl-8">제척 조건 선택
            </div>
          </div>

          <div className="p-16 border-1 border-gray-200 border-top-0">
            <table className="table-info">
              <colgroup>
                <col width="20%"/>
                <col width="10%"/>
                <col width="70%"/>
              </colgroup>
              <tbody>
              <tr>
                <th className="text-primary">산학연</th>
                <td colSpan="2">
                      <span className="flex-row gap-16">
                        {initialState && initialState.orgnData.map((state) => (
                          <div className="check-label" key={state.etcRmkCn1}>
                            <input
                              type="checkbox"
                              name={'orgnType'}
                              id={`orgn${state.etcRmkCn1}`}
                              checked={formData.excludeCond.orgnType.includes(...state.etcRmkCn1)}
                              onChange={(e) => arrayChangeHandler(e, state.etcRmkCn1)}
                            />
                            <label htmlFor={`orgn${state.etcRmkCn1}`}>{state.title}</label>
                          </div>
                        ))
                        }
                      </span>
                </td>
              </tr>
              <tr>
                <th className="text-primary">최종학력</th>
                <td colSpan="2">
                      <span className="flex-row gap-16">
                        {initialState && initialState.degData.map((state) => (
                          <div className="check-label" key={state.etcRmkCn1}>
                            <input
                              type="checkbox"
                              name={'cmcarrSchs.degCd'}
                              id={`lastEdu${state.etcRmkCn1}`}
                              checked={formData.excludeCond['cmcarrSchs.degCd'].includes(...state.etcRmkCn1)}
                              onChange={(e) => arrayChangeHandler(e, state.etcRmkCn1)}
                            />
                            <label htmlFor={`lastEdu${state.etcRmkCn1}`}>{state.title}</label>
                          </div>
                        ))
                        }

                      </span>
                </td>
              </tr>
              <tr>
                <th className="text-primary">지역</th>
                <td colSpan="2">
                      <span className="flex-row gap-16">
                        {initialState && initialState.sidoData.map((state) => (
                          <div className="check-label" key={state.etcRmkCn1}>
                            <input
                              type="checkbox"
                              name={"sido"}
                              id={`area${state.etcRmkCn1}`}
                              checked={state.etcRmkCn1 ? formData.excludeCond.sido.includes(...state.etcRmkCn1) : false}
                              onChange={(e) => arrayChangeHandler(e, state.etcRmkCn1)}/>
                            <label htmlFor={`area${state.etcRmkCn1}`}>{state.title}</label>
                          </div>
                        ))
                        }

                      </span>
                </td>
              </tr>
              <tr>
                <th className="text-primary">참여인력</th>
                <td colSpan="2">
                      <span className="flex-row-cont items-center text-16-r">
                        <input
                          type="number"
                          min={0}
                          name={"excludeCond.sbjtCnt1y"}
                          className="text-right mr-4"
                          placeholder="횟수 입력"
                          value={formData.excludeCond.sbjtCnt1y ? formData.excludeCond.sbjtCnt1y : ""}
                          onChange={(e) => wordChangeHandler(e)}
                        /> 회
                      </span>
                </td>
              </tr>
              <tr>
                <th className="text-primary">1년이내 불참</th>
                <td colSpan="2">
                      <span className="flex-row-cont items-center text-16-r">
                        <input
                          type="number"
                          min={0}
                          name={"excludeCond.excldCnt1y"}
                          className="text-right mr-4"
                          placeholder="횟수 입력"
                          value={formData.excludeCond.excldCnt1y ? formData.excludeCond.excldCnt1y : ""}
                          onChange={(e) => wordChangeHandler(e)}
                        /> 회
                      </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr className="w-full mt-40 mb-16"/>
        <div className="mlr-24">
          <div className="flex-row items-center mb-16">
            <div className="form-label-text">사용여부</div>
            <div className="radio-box-type ml-auto flex-row gap-16">
              <input
                type="radio"
                name="useYn"
                value={"Y"}
                id="radio-box-type-1"
                checked={formData.useYn === "Y"}
                onChange={(e) => wordChangeHandler(e)}
              />
              <label htmlFor="radio-box-type-1">사용</label>
              <input
                type="radio"
                name="useYn"
                value={"N"}
                id="radio-box-type-2"
                checked={formData.useYn === "N"}
                onChange={(e) => wordChangeHandler(e)}
              />
              <label htmlFor="radio-box-type-2">미사용</label>
            </div>
          </div>
          {insertFormVisible &&
            <button
              type="button"
              className="btn-primary-48 w-full mt-16"
              onClick={() => condInsertHandler(formData)}
            >추가하기</button>
          }
        </div>
      </div>
    </form>
  )
};

export default CondForm;