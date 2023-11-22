import React, {useEffect, useState} from 'react';
import {notification, Select, Slider} from 'antd';
const { Option } = Select;
const ReqrInputItems = (
  {
    visible=false,
    submitBusinessPlanHandler,
    sbjtSmrData,
    labelData,
    selectedSubject
  }
) => {

  const initialValues = {
    pstTchLv: 0,
    aftTchLv: 0,
    pstTchIdp: 0,
    aftTchIdp: 0,
    sales: 5,
    oprtPrft: 5,
    roi: 0,
    empNum: 0,
    ythNum: 5,
    oldNum: 5,
    exports: 5,
    orgn: [],
    business: [],
    rvnRpc: 5,
    rdcPdtCst: 5,
  };

  const [inputFormData, setInputFormData] = useState(initialValues);

  const selectChangeHandler = (value, name) => {
    setInputFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  };
  const wordChangeHandler = (e) => {
    const replaceWord = Number(e.target.value.replace(/[^0-9]/g, '').replace(/(^0+)/, ""))

    setInputFormData((prevState) => ({
      ...prevState,
      [e.target.name]: replaceWord
    }));
  };
  const dataSource = {
    orgnType: [
      {key: 0, value: '기업부설연구소'}, {key: 1, value: '연구개발전담부서'}, {key: 2, value: '전담마케팅부서'}],
    businessType: [
      {key: 0, value: 'B2B'}, {key: 1, value: 'B2C'}, {key: 2, value: 'B2G'}],
    idstUnivRsch:  [
      {
        key: 0,
        value: '미보유'
      },
      {
        key: 1,
        value: '산산'
      },
      {
        key: 2,
        value: '산연'
      },
      {
        key: 3,
        value: '산학'
      }
    ],
    cmrStg: [
      {
        key: 0,
        value: '사업화 포기'
      },
      {
        key: 1,
        value: '시제품 제작'
      },
      {
        key: 2,
        value: '사업화 준비중'
      },
      {
        key: 3,
        value: '매출 발생'
      }
    ],
    TLCType: [
      {
        key: 0,
        value: '개발기'
      },
      {
        key: 1,
        value: '도입기'
      },
      {
        key: 2,
        value: '성장기'
      },
      {
        key: 3,
        value: '성숙기'
      },
      {
        key: 4,
        value: '쇠퇴기'
      }
    ],
    sbjtPtcpStts: [
      {
        key: 0,
        value: '주관기관'
      },
      {
        key: 2,
        value: '공동개발기관'
      },
      {
        key: 1,
        value: '참여기업'
      }
    ]
  };

  const openNotification = (type, msg, desc) => {
    notification[type]({
      message: msg,
      description: desc,
      placement: "bottomRight"
    })
  }

  const zToHMarks = {
    0: '0',
    5: '50',
    10: '100',
  };
  const nOToOMarks = {
    0: '-1',
    5: '0',
    10: '1'
  };
  const ZToTMarks = {
    0: 0,
    5: 1,
    10: 2.0
  };

  const selectBoxDataSet = {
    iur: 31,
    sbjtPtcpStts: 20,
    cmrStg: 48,
    tlc: 47
  };
  const sliderDataSet = {
    pstTchIdp: 11,
    aftTchIdp: 12,
    pstTchLv: 15,
    aftTchLv: 16,
    roi: 17,
    sales: 24,
    exports: 28,
    oprtPrft: 30,
    oldNum: 36,
    ythNum: 37,
    empNum: 39,
    rvnRpc: 57,
    rdcPdtCst: 58,
  };
  const inputDataSet = {
    ptcRsch: 51,
    mstNum: 52,
    bchNum: 53,
    ptnAppl: 54,
    ptnReg: 55,
  };

  useEffect(() => {
    if (sbjtSmrData && Object.keys(sbjtSmrData).includes('crntData')) {
      setInputFormData(initialValues);
      sbjtSmrData.crntData.map((orgn) => {
        const dataHandler = (set, name) => {
          const keys = Object.keys(set);
          keys.map((key) => {
            if (set[key] === orgn['VAR_ID']) {
              setInputFormData((prevState) => ({
                ...prevState,
                [key]: set === sliderDataSet ? Number(orgn[name].split('_')[1]) - 1 : set === selectBoxDataSet ? selectBoxDataSet[key] === "tlc" ? Number(orgn[name]) : Number(orgn[name])-1 : orgn[name]
              }))
            }
          })
        };
        dataSource.orgnType.map((data) => {
          setInputFormData((prevState) => ({
            ...prevState,
            orgn: orgn['CD_NM'] === "보유" && orgn['VAR_NM'] === data.value ? [...prevState.orgn, data.key] : [...prevState.orgn]
          }))
        })
        dataSource.businessType.map((data) => {
          setInputFormData((prevState) => ({
            ...prevState,
            business: orgn['CD_NM'] === "보유" && orgn['VAR_NM'] === data.value ? [...prevState.business, data.key] : [...prevState.business]
          }))
        })

        dataHandler(inputDataSet, 'VAR_DTL_VAL')
        dataHandler(selectBoxDataSet, 'VAR_ITEM_VARI_VAL')
        dataHandler(sliderDataSet, 'CD_NM')
      });
    } else {
      setInputFormData(initialValues);
    }
  },[sbjtSmrData]);

  const [validate, setValidate] = useState(false);

  const validateHandler = (formData) => {
    const crntKeys = Object.keys(formData);
    if (crntKeys.length !== 24) {
      return false
    }
    const crntValues = Object.values(formData);
    for (let val in crntValues) {
      if (typeof crntValues[val] === 'object' && crntValues[val].length === 0) {
        return false
      }
    }
    return true
  };

  useEffect(() => {
    setValidate(validateHandler(inputFormData));
  },[inputFormData]);

  const convertMoneyAmountFormat = (item) => {
    return item ? item.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') : 0
  }

  return (
    <>
      {!visible ?
        <div className="frame-cont bg-white" style={{height: "calc(100vh - 437px)"}}>
          <div className="flex-col gap-16 items-center">
            <p className="text-14-m text-gray-400">업체 조회 후 확인할 수 있습니다.</p>
          </div>
        </div>
        :
        // <!-- 필요입력항목 -->
        <div className="p-16 pb-0 overflow-auto" style={{height: "calc(100vh - 397px)"}}>
          <div className="grid-col-2">
            <div className={"border-right-200 pr-24"}>
              <h5 className="font-bold-500 mb-8">기관 요약</h5>
              <div className="grid-col-3 mb-8">
                <div className="form-label-text">기관구성</div>
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder={'기관 구성을 선택해주세요.'}
                    className={'col-span-2'}
                    value={inputFormData.orgn}
                    onChange={(value) => selectChangeHandler(value, 'orgn')}
                  >
                    {dataSource.orgnType.map((t) => <Option key={t.key} value={t.key}>{t.value}</Option>)}
                  </Select>
              </div>
              <div className="grid-col-3 mb-8">
                <div className="form-label-text">사업유형</div>
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder={'사업 유형을 선택해주세요.'}
                    className={'col-span-2'}
                    value={inputFormData.business}
                    onChange={(value) => selectChangeHandler(value, 'business')}
                  >
                    {dataSource.businessType.map((t) => <Option key={t.key} value={t.key}>{t.value}</Option>)}
                  </Select>
              </div>
              <div className={'grid-col-3 mb-8 yebi-32'}>
                <div className="form-label-text">과제참여행태</div>
                  <Select
                    className={'col-span-2'}
                    placeholder={'과제참여행태를 선택해주세요.'}
                    value={inputFormData.sbjtPtcpStts}
                    onChange={(value) => selectChangeHandler(value, 'sbjtPtcpStts')}
                  >
                    {dataSource.sbjtPtcpStts.map((status) => <Option key={status.key} value={status.key}>{status.value}</Option>)}
                  </Select>
              </div>
              <div className="grid-col-3 mb-8 yebi-32">
                <div className="form-label-text">융복합 신학연</div>
                <Select
                  className={'col-span-2'}
                  placeholder={'산학연을 선택해주세요.'}
                  value={inputFormData.iur}
                  onChange={(value) => selectChangeHandler(value, 'iur')}
                >
                  {dataSource.idstUnivRsch.map((t) => <Option key={t.key} value={t.key}>{t.value}</Option>)}
                </Select>
              </div>
              <div className={'grid-col-3 yebi-32'}>
                <div className="form-label-text">사업화 단계</div>
                  <Select
                    className={'col-span-2'}
                    placeholder={'사업화 단계를 선택해주세요.'}
                    value={inputFormData.cmrStg}
                    onChange={(value) => selectChangeHandler(value, 'cmrStg')}
                  >
                    {dataSource.cmrStg.map((t) => <Option key={t.key} value={t.key}>{t.value}</Option>)}
                  </Select>
              </div>
              <hr className="mtb-16"/>
                <h5 className="font-bold-500 mb-8">기술 요약</h5>
                <div className="grid-col-3 mb-8 yebi-32">
                  <div className="form-label-text">기술수명주기</div>
                  <Select
                    className={'col-span-2'}
                    placeholder={'기술수명주기를 선택해주세요.'}
                    value={inputFormData.tlc}
                    onChange={(value) => selectChangeHandler(value, 'tlc')}
                  >
                    {dataSource.TLCType.map((tlc) => <Option key={tlc.key} value={tlc.key}>{tlc.value}</Option>)}
                  </Select>
                </div>
                <div className="grid-col-3 mb-8">
                  <div className="form-label-text">기술수준<p className="ml-4 mt-4">(수행 전)</p></div>
                  <div className="col-span-2 border-box h-40" style={{display: 'inline-block'}}>
                    <Slider
                      marks={zToHMarks}
                      included={false}
                      defaultValue={0}
                      step={1}
                      min={0}
                      max={10}
                      value={inputFormData.pstTchLv}
                      tipFormatter={(value) => `${value * 10}%`}
                      onChange={(value) => selectChangeHandler(value, 'pstTchLv')}
                    />
                  </div>
                </div>
                <div className="grid-col-3 mb-8">
                  <div className="form-label-text">기술수준<p className="ml-4 mt-4">(수행 후)</p></div>
                  <div className="col-span-2 border-box h-40" style={{display: 'inline-block'}}>
                    <Slider
                      marks={zToHMarks}
                      included={false}
                      defaultValue={0}
                      step={1}
                      min={0}
                      max={10}
                      value={inputFormData.aftTchLv}
                      tipFormatter={(value) => `${value * 10}%`}
                      onChange={(value) => selectChangeHandler(value, 'aftTchLv')}
                    />
                  </div>
                </div>
                <div className="grid-col-3 mb-8">
                  <div className="form-label-text">기술자립도<p className="ml-4 mt-4">(수행 전)</p></div>
                  <div className="col-span-2 border-box h-40" style={{display: 'inline-block'}}>
                    <Slider
                      marks={zToHMarks}
                      included={false}
                      defaultValue={0}
                      step={1}
                      min={0}
                      max={10}
                      tipFormatter={(value) => `${value * 10}%`}
                      value={inputFormData.pstTchIdp}
                      onChange={(value) => selectChangeHandler(value, 'pstTchIdp')}
                    />
                  </div>
                </div>
                <div className="grid-col-3">
                  <div className="form-label-text">기술자립도<p className="ml-4 mt-4">(수행 후)</p></div>
                  <div className="col-span-2 border-box h-40" style={{display: 'inline-block'}}>
                    <Slider
                      marks={zToHMarks}
                      included={false}
                      defaultValue={0}
                      step={1}
                      min={0}
                      max={10}
                      tipFormatter={(value) => `${value * 10}%`}
                      value={inputFormData.aftTchIdp}
                      onChange={(value) => selectChangeHandler(value, 'aftTchIdp')}
                    />
                  </div>
                </div>
                <p className="ol text-14 font-bold-500 mt-16 mb-8">제품성능지표</p>
                <div className="grid-col-4 gap-16">
                  <div className="form-label-text text-12-m font-space-1">성능지표 현재 (%)</div>
                  <input
                    type="number"
                    className="h-32 w-full text-right"
                    name={'pstPerf'}
                    disabled={true}
                    value={Object.keys(sbjtSmrData).includes('perf') && sbjtSmrData.perf.prdValue ? sbjtSmrData.perf.prdValue : ''}
                  />
                    <div className="form-label-text text-12-m font-space-1">성능지표 목표 (%)</div>
                    <input
                      type="number"
                      className="h-32 w-full text-right"
                      name={'aftPerf'}
                      disabled={true}
                      value={Object.keys(sbjtSmrData).includes('perf') && sbjtSmrData.perf.goalValue ? sbjtSmrData.perf.goalValue : ''}
                    />
                </div>
                <p className="ol text-14 font-bold-500 mt-16 mb-8">R&D 성과<span className="text-12-r text-gray-600 ml-4">(연간등록)</span></p>
                <div className="grid-col-4 gap-16">
                  <div className="form-label-text text-12-m font-space-1">특허 출원 (건)</div>
                  <input
                    type="number"
                    className="h-32 w-full text-right"
                    placeholder="숫자를 입력해주세요."
                    min={0}
                    name={'ptnAppl'}
                    value={Object.keys(inputFormData).includes('ptnAppl') ? (inputFormData.ptnAppl ? inputFormData.ptnAppl : 0) : ''}
                    onChange={(e) => wordChangeHandler(e)}
                  />
                    <div className="form-label-text text-12-m font-space-1">특허 등록 (건)</div>
                    <input
                      type="number"
                      className="h-32 w-full text-right"
                      placeholder="숫자를 입력해주세요."
                      min={0}
                      name={'ptnReg'}
                      value={Object.keys(inputFormData).includes('ptnReg') ? (inputFormData.ptnReg ? inputFormData.ptnReg : 0) : ''}
                      onChange={(e) => wordChangeHandler(e)}
                    />
                </div>
            </div>

            <div className="pl-24">
              <h5 className="font-bold-500 mb-8">인력 구성</h5>
              <div className="grid-col-3 mb-8">
                <div className="form-label-text">총 종업원 수<p className="ml-4 mt-4">(%)</p></div>
                <div className="col-span-2 border-box h-40" style={{display: 'inline-block'}}>
                  <Slider
                    //marks={nOToOMarks}
                    included={false}
                    defaultValue={-1}
                    step={1}
                    min={0}
                    max={10}
                    tipFormatter={(value) => labelData ? labelData.empNum[value] : value}
                    value={inputFormData.empNum}
                    onChange={(value) => selectChangeHandler(value, 'empNum')}
                  />
                </div>
              </div>
              <div className="grid-col-3 mb-8">
                <div className="form-label-text">참여연구원<p className="ml-4 mt-4">(명)</p></div>
                <input
                  type="number"
                  className="h-32 w-full text-right col-span-2"
                  placeholder="숫자를 입력해주세요."
                  min={0}
                  name={'ptcRsch'}
                  value={Object.keys(inputFormData).includes('ptcRsch') ? (inputFormData.ptcRsch ? inputFormData.ptcRsch : 0) : ''}
                  onChange={(e) => wordChangeHandler(e)}
                />
              </div>
              <div className="grid-col-4 gap-16">
                <div className="form-label-text">석사급이상<p className="ml-4 mt-4">(명)</p></div>
                <input
                  type="number"
                  className="h-32 w-full text-right"
                  placeholder="숫자를 입력해주세요."
                  min={0}
                  name={'mstNum'}
                  value={Object.keys(inputFormData).includes('mstNum') ? (inputFormData.mstNum ? inputFormData.mstNum : 0) : ''}
                  onChange={(e) => wordChangeHandler(e)}
                />
                <div className="form-label-text">학사급<p className="ml-4 mt-4">(명)</p></div>
                <input
                  type="number"
                  className="h-32 w-full text-right"
                  placeholder="숫자를 입력해주세요."
                  min={0}
                  name={'bchNum'}
                  value={Object.keys(inputFormData).includes('bchNum') ? (inputFormData.bchNum ? inputFormData.bchNum : 0) : ''}
                  onChange={(e) => wordChangeHandler(e)}
                />
              </div>
              <p className="ol text-14 font-bold-500 mt-16 mb-8">예상 신규고용</p>
              <div className="grid-col-3 mb-8">
                <div className="form-label-text">청년인력<p className="ml-4 mt-4">(증감)</p></div>
                <div className="col-span-2 border-box h-40" style={{display: 'inline-block'}}>
                  <Slider
                    //marks={nOToOMarks}
                    included={false}
                    defaultValue={-1}
                    step={1}
                    min={0}
                    max={10}
                    tipFormatter={(value) => labelData ? labelData.ythNum[value] : value}
                    value={inputFormData.ythNum}
                    onChange={(value) => selectChangeHandler(value, 'ythNum')}
                  />
                </div>
              </div>
              <div className="grid-col-3">
                <div className="form-label-text">청년외 인력<p className="ml-4 mt-4">(증감)</p></div>
                <div className="col-span-2 border-box h-40" style={{display: 'inline-block'}}>
                  <Slider
                    //marks={nOToOMarks}
                    included={false}
                    defaultValue={-1}
                    step={1}
                    min={0}
                    max={10}
                    tipFormatter={(value) => labelData ? labelData.oldNum[value] : value}
                    value={inputFormData.oldNum}
                    onChange={(value) => selectChangeHandler(value, 'oldNum')}
                  />
                </div>
              </div>
              <hr className="mtb-16"/>
                <h5 className="font-bold-500 mb-8">사업성 요약</h5>
                <div className="grid-col-3 gap-16 mb-8">
                  <div className="form-label-text">매출액 예상 증감</div>
                  <div className="col-span-2 border-box h-40" style={{display: 'inline-block'}}>
                    <Slider
                      //marks={ZToTMarks}
                      included={false}
                      defaultValue={-1}
                      step={1}
                      min={0}
                      max={10}
                      value={inputFormData.sales}
                      // tipFormatter={(value) => labelData ? labelData.sales[value] : value}
                      tipFormatter={(value) => sbjtSmrData.kedSales ? value === 5 ? '변동 없음' : `${convertMoneyAmountFormat(Math.round(Number(sbjtSmrData.kedSales)*((value-5)*0.1)))}(${value -5 < 0 ? '' : '+'}${(value-5)*10}%)` : labelData ? labelData.sales[value] : value}
                      onChange={(value) => selectChangeHandler(value, 'sales')}
                    />
                  </div>
                </div>
                <div className="grid-col-3 gap-16 mb-8">
                  <div className="form-label-text">수출액 예상 증감</div>
                  <div className="col-span-2 border-box h-40" style={{display: 'inline-block'}}>
                    <Slider
                      //marks={nOToOMarks}
                      included={false}
                      defaultValue={-1}
                      step={1}
                      min={0}
                      max={10}
                      value={inputFormData.exports}
                      // tipFormatter={(value) => labelData ? labelData.exports[value] : value}
                      tipFormatter={(value) => sbjtSmrData.kedExports ? value === 5 ? '변동 없음' : `${convertMoneyAmountFormat(Math.round(Number(sbjtSmrData.kedExports)*((value-5)*0.1)))}(${value -5 < 0 ? '' : '+'}${(value-5)*10}%)` : labelData ? labelData.exports[value] : value}
                      onChange={(value) => selectChangeHandler(value, 'exports')}
                    />
                  </div>
                </div>
                <div className="grid-col-3 gap-16 mb-8">
                  <div className="form-label-text">영업이익 예상 증감</div>
                  <div className="col-span-2 border-box h-40" style={{display: 'inline-block'}}>
                    <Slider
                      //marks={nOToOMarks}
                      included={false}
                      defaultValue={-1}
                      step={1}
                      min={0}
                      max={10}
                      value={inputFormData.oprtPrft}
                      // tipFormatter={(value) => labelData ? labelData.oprtPrft[value] : value}
                      tipFormatter={(value) => sbjtSmrData.kedOprtPrft ? value === 5 ? '변동 없음' : `${convertMoneyAmountFormat(Math.round(Number(sbjtSmrData.kedOprtPrft)*((value-5)*0.1)))}(${value -5 < 0 ? '' : '+'}${(value-5)*10}%)` : labelData ? labelData.oprtPrft[value] : value}
                      onChange={(value) => selectChangeHandler(value, 'oprtPrft')}
                    />
                  </div>
                </div>
                <div className="grid-col-3 gap-16">
                  <div className="form-label-text">투자회수율 (ROI)예상</div>
                  <div className="col-span-2 border-box h-40" style={{display: 'inline-block'}}>
                    <Slider
                      //marks={ZToTMarks}
                      included={false}
                      defaultValue={-1}
                      step={1}
                      min={0}
                      max={10}
                      value={inputFormData.roi}
                      //tipFormatter={(value) => labelData ? labelData.roi[value] : value}
                      tipFormatter={(value) =>
                        sbjtSmrData?.totalCost ?
                          // value ? convertMoneyAmountFormat(Math.round(Number(sbjtSmrData.totalCost)*(value*0.2))) : convertMoneyAmountFormat(Math.round(Number(sbjtSmrData.totalCost)))
                          `${convertMoneyAmountFormat(Math.round(Number(sbjtSmrData.totalCost)*(value*0.2)))}(${value*20}%)`
                          :
                          labelData ? labelData.roi[value] : value
                      }
                      onChange={(value) => selectChangeHandler(value, 'roi')}
                    />
                  </div>
                </div>
              <div className="grid-col-3 gap-16">
                <div className="form-label-text">생산비용절감 예상</div>
                <div className="col-span-2 border-box h-40" style={{display: 'inline-block'}}>
                  <Slider
                    //marks={nOToOMarks}
                    included={false}
                    defaultValue={5}
                    step={1}
                    min={0}
                    max={10}
                    value={inputFormData.rdcPdtCst}
                    tipFormatter={(value) => labelData ? labelData.rdcPdtCst[value] : value}
                    onChange={(value) => selectChangeHandler(value, 'rdcPdtCst')}
                  />
                </div>
              </div>
              <div className="grid-col-3 gap-16">
                <div className="form-label-text">수입대체 예상</div>
                <div className="col-span-2 border-box h-40" style={{display: 'inline-block'}}>
                  <Slider
                    //marks={nOToOMarks}
                    included={false}
                    defaultValue={5}
                    step={1}
                    min={0}
                    max={10}
                    value={inputFormData.rvnRpc}
                    tipFormatter={(value) => labelData ? labelData.rvnRpc[value] : value}
                    onChange={(value) => selectChangeHandler(value, 'rvnRpc')}
                  />
                </div>
              </div>
                <div className="yebi-btn-scroll-fixed">
                  <p className="text-14-r text-gray-600">
                    신청과제 관련한 내용을 사실과 같이 입력하였으며, 부적절한 입력으로 인한 불이익을 감수하겠습니다.
                  </p>
                  <button
                    type="button"
                    className="btn-primary-48 w-full mt-8 mb-16"
                    disabled={!selectedSubject}
                    onClick={() => validate ? submitBusinessPlanHandler(inputFormData) : openNotification('warning','필요입력항목을 모두 입력해주세요.')}
                  >사업계획서 보완자료 입력 완료</button>
                </div>
            </div>
          </div>
        </div>
      }
    </>
  )
};

export default ReqrInputItems