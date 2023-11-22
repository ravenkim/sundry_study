import React, {useState} from 'react';

const ConditionForm = ({searchForm, setSearchForm, areaList, orgnTypeList, degList}) => {

        const [isBasicCondOpen, setIsBasicCondOpen] = useState(false);
        const [isExcluCondOpen, setIsExcluCondOpen] = useState(false);

        const basicCondOpenHandler = () => {
            setIsBasicCondOpen(!isBasicCondOpen);
        }

        const excluCondOpenHandler = () => {
            setIsExcluCondOpen(!isExcluCondOpen);
        }

        const subjectCntChangeHandler = (e) => {
            setSearchForm((prev) => ({
                ...prev,
                subjectCnt: e.target.value,
            }))
        }

        const evlMbrCntChangeHandler = (e) => {
            setSearchForm((prev) => ({
                ...prev,
                evlMbrCnt: e.target.value,
            }))
        }

        const orgnTypeChangeHandler = (e) => {
            let {value, checked} = e.target;

            let orgnTypeValue = checked ? [...new Set([...searchForm.orgnType, ...value.split(",")])] : searchForm.orgnType.filter((item) => !value.split(",").includes(item))

            setSearchForm((prev) => ({
                ...prev,
                orgnType: orgnTypeValue
            }))
        }

        const degreeChangeHandler = (e) => {
            let {value, checked} = e.target;

            let degreeValue = checked ? [...new Set([...searchForm.degCd, ...value.split(",")])] : searchForm.degCd.filter((item) => !value.split(",").includes(item))

            setSearchForm((prev) => ({
                ...prev,
                degCd: degreeValue
            }))
        }

        const areaChangeHandler = (e) => {
            let {value, checked} = e.target;

            let sidoValue = checked ? [...new Set([...searchForm.sido, ...value.split(",")])] : searchForm.sido.filter((item) => !value.split(",").includes(item))

            setSearchForm((prev) => ({
                ...prev,
                sido: sidoValue
            }))
        }

        const sbjtCnt1yChangeHandler = (e) => {
            setSearchForm((prev) => ({
                ...prev,
                sbjtCnt1y: e.target.value,
            }))
        }

        const excldCnt1yChangeHandler = (e) => {
            setSearchForm((prev) => ({
                ...prev,
                excldCnt1y: e.target.value,
            }))
        }

        return (
            <>
                <h5 className="mt-40 mb-16">분과 구성</h5>
                <div className="frame bg-gray-100 p-16 flex-col gap-16">
                    <div className="grid-col-3 items-center">
                        <div className="col-span-1">
                            <div className="form-label-text">분과 별 과제 수</div>
                        </div>
                        <div></div>
                        <div className="col-span-1">
                            <input type="number" className="text-right w-full" id={"subjectCnt"} onChange={subjectCntChangeHandler}
                                   value={searchForm.subjectCnt} min={0} style={{width:'170px'}}/>
                        </div>
                    </div>
                    <div className="grid-col-3 items-center">
                        <div className="col-span-1">
                            <div className="form-label-text">배정 평가위원 수</div>
                        </div>
                        <div></div>
                        <div className="col-span-1">
                            <input type="number" className="text-right w-full" id={"evlMbrCnt"} value={searchForm.evlMbrCnt}
                                   onChange={evlMbrCntChangeHandler} min={0} style={{width:'170px'}}/>
                        </div>
                    </div>
                </div>

                <h5 className="mt-40 mb-16">평가위원 구성</h5>
                <div className="drop-down-content" onClick={excluCondOpenHandler}>
                    <div className="drop-down pl-8">제척 조건 선택
                        <button type="button" className="list-icon-down"/>
                    </div>
                </div>
                {isExcluCondOpen &&
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
                                    {
                                        orgnTypeList.map((item, idx) =>
                                            <div className="check-label" key={idx}>
                                                <input type={"checkbox"} id={`orgnType_${idx}`} name={"orgnType"}
                                                       value={item.etcRmkCn1.split(",")}
                                                       onChange={orgnTypeChangeHandler}
                                                       checked={searchForm.orgnType.includes(...item.etcRmkCn1.split(","))}/>
                                                <label htmlFor={`orgnType_${idx}`}>{item.commCdNm}</label>
                                            </div>
                                        )
                                    }
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th className="text-primary">최종학력</th>
                            <td colSpan="2">
                                <span className="flex-row gap-16">
                                    {
                                        degList.map((item, idx) => (
                                            <div className="check-label" key={idx}>
                                                <input type="checkbox" name="degree" value={item.etcRmkCn1.split(",")}
                                                       onChange={degreeChangeHandler}
                                                       checked={searchForm.degCd.includes(...item.etcRmkCn1.split(","))}
                                                       id={`degCd_${idx}`}/>
                                                <label htmlFor={`degCd_${idx}`}>{item.commCdNm}</label>
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
                                    {
                                        areaList.map((item, idx) => (
                                            <div className="check-label" key={idx}>
                                                <input type="checkbox" name="sido"
                                                       value={item.etcRmkCn1 ? item.etcRmkCn1.split(",") : ""}
                                                       onChange={areaChangeHandler}
                                                       checked={searchForm.sido.includes(...item.etcRmkCn1.split(","))}
                                                       id={`sido_${idx}`}/>
                                                <label htmlFor={`sido_${idx}`}>{item.commCdNm}</label>
                                            </div>
                                        ))
                                    }
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th className="text-primary">참여이력</th>
                            <td colSpan="2">
                                <span className="flex-row-cont items-center text-16-r">
                                  <input type="number" className="text-right mr-4" placeholder="횟수 입력"
                                         value={searchForm.sbjtCnt1y} onChange={sbjtCnt1yChangeHandler} min={0}/> 회
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th className="text-primary">불참이력</th>
                            <td colSpan="2">
                                <span className="flex-row-cont items-center text-16-r">
                                  <input type="number" className="text-right mr-4" placeholder="횟수 입력"
                                         value={searchForm.excldCnt1y} onChange={excldCnt1yChangeHandler} min={0}/> 회
                                </span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                }

            </>
        );
    }
;

export default ConditionForm;