import React, {useState} from 'react';
import LimeSortingLabel from "features/common/tool/sorting/LimeSortingLabel";

const MbrTab = ({orderData, mbrList, sortingChangeHandler, mbrDetailModalOpenHandler}) => {

    const [isItcFitnessTooltipShown, setIsItcFitnessTooltipShown] = useState(false);
    const [isScoreTooltipShown, setIsScoreTooltipShown] = useState(false);
    const [isCsnSmrltyTooltipShown, setIsCsnSmrltyTooltipShown] = useState(false);

    return (
        <div className="table-wrap" style={{height: "calc(100vh - 437px)"}}>
            <table className="striped tooltip-table">
                <colgroup>
                    <col width="5%"/>
                    <col width="10%"/>
                    <col width="13%"/>
                    <col width="14%"/>
                    <col width="9%"/>
                    <col width="9%"/>
                    <col width="10%"/>
                    <col width="13%"/>
                    <col width="9%"/>
                    <col width="8%"/>
                </colgroup>
                <thead>
                <tr>
                    <th className="text-center">No</th>
                    <th>
                        평가위원명
                    </th>
                    <th>기술분류</th>
                    <th>소속기관</th>
                    <th className="ptb-0">
                        <LimeSortingLabel
                            targetKey={"itcFitness"}
                            label={
                                <>
                                    기술분류<br/>적합도
                                    <span className="mdi mdi-help-circle text-gray-400 text-icon-16 ml-4"
                                          onMouseEnter={() => setIsItcFitnessTooltipShown(true)}
                                          onMouseLeave={() => setIsItcFitnessTooltipShown(false)}
                                    ></span>
                                </>
                            }
                            labelStyle={{color: "#636871"}}
                            defaultSorting={orderData.itcFitness}
                            sortingChangeHandler={sortingChangeHandler}
                        />

                    </th>
                    <th>
                        <LimeSortingLabel
                            targetKey={"score"}
                            label={
                                <>
                                    과제<br/>관련도
                                    <span className="mdi mdi-help-circle text-gray-400 text-icon-16 ml-4"
                                          onMouseEnter={() => setIsScoreTooltipShown(true)}
                                          onMouseLeave={() => setIsScoreTooltipShown(false)}
                                    ></span>
                                </>
                            }
                            labelStyle={{color: "#636871"}}
                            defaultSorting={orderData.score}
                            sortingChangeHandler={sortingChangeHandler}
                        />

                    </th>
                    <th>
                        <LimeSortingLabel
                            targetKey={"csnSmrlty"}
                            label={
                                <>
                                    기술용어<br/>유사도
                                    <span className="mdi mdi-help-circle text-gray-400 text-icon-16 ml-4"
                                          onMouseEnter={() => setIsCsnSmrltyTooltipShown(true)}
                                          onMouseLeave={() => setIsCsnSmrltyTooltipShown(false)}
                                    ></span>
                                </>
                            }
                            labelStyle={{color: "#636871"}}
                            defaultSorting={orderData.csnSmrlty}
                            sortingChangeHandler={sortingChangeHandler}
                        />

                    </th>
                    <th className="text-center">
                        <LimeSortingLabel
                            targetKey={"scssPcnt5y"}
                            label={
                                <>
                                    평가성과<br/>
                                    <span class="flex-row items-start justify-center text-12">
                                        (최근 5년 평가성공률)
                                    </span>
                                </>
                            }
                            labelStyle={{color: "#636871"}}
                            defaultSorting={orderData.scssPcnt5y}
                            sortingChangeHandler={sortingChangeHandler}
                        />

                    </th>
                    <th className="text-center">

                        <LimeSortingLabel
                            targetKey={"sbjtCnt1y"}
                            label={
                                <>
                                    평가횟수<br/>
                                    <span class="flex-row items-start justify-center text-12">
                                        (최근 1년)
                                    </span>
                                </>
                            }
                            labelStyle={{color: "#636871"}}
                            defaultSorting={orderData.sbjtCnt1y}
                            sortingChangeHandler={sortingChangeHandler}
                        />
                    </th>
                    <th>5년 누적<br/>평가 회수</th>
                </tr>
                </thead>
                <tbody id="tbody-for3" className="tbody">

                {
                    mbrList.length > 0 && mbrList.map((item, idx) => (
                        <tr key={idx} style={{cursor: "pointer"}}
                            onClick={() => mbrDetailModalOpenHandler(item)}>
                            <td className="text-center">{idx + 1}</td>
                            <td>{item.source.mbrNm}{item.source.scssPcnt5y == 0 ? <span className="badge-orange ml-8">신규</span> : '' }</td>
                            <td>
                                {
                                    // item.source.pmsEcmsnTechClsf && item.source.pmsEcmsnTechClsf.length> 0 &&item.source.pmsEcmsnTechClsf.map((item,idx)=> {
                                    //     let returnValue = "";
                                    //     if(idx!==0){
                                    //         returnValue+=", "
                                    //     }
                                    //     returnValue += item.teclCdNm;
                                    //     return returnValue;
                                    // })
                                    item.source.docSubclassNm
                                }
                            </td>
                            <td>{item.source.orgnNm}</td>
                            <td>{(item.itcFitness*100).toFixed(2)}</td>
                            <td>{item.score}</td>
                            <td>{item.csnSmrlty}</td>
                            <td className={item.source.scssPcnt5y == 0 ? 'text-center' : 'text-center text-primary'}>{item.source.scssPcnt5y == 0 ? '-' : item.source.scssPcnt5y+' %'}</td>
                            <td className="text-center">{item.source.sbjtCnt1y} 회</td>
                            <td className="text-center">{item.source.evalCnt5y}</td>
                        </tr>
                    ))

                }
                </tbody>
            </table>

            <div id='tooltip1' className={isItcFitnessTooltipShown ? 'tooltip-helper tooltip-helper-hover' : 'tooltip-helper'} style={{top: `-48px`, left: `38%`}}>
                <div className="flex-col">
                    <p>기술분류 적합도</p>
                    <p>분과내 과제와 평가위원이 평가한 과제의 기술분류 적합성을 ITC분류모델을 이용하여 집계한 값</p>
                </div>
            </div>

            <div id='tooltip2' className={isScoreTooltipShown ? 'tooltip-helper tooltip-helper-hover' : 'tooltip-helper'} style={{top: `-48px`, left: `51%`}}>
                <div className="flex-col">
                    <p>과제관련도</p>
                    <p>분과내 과제의 '주요 용어'로써 가장 적합한 평가위원을 랭킹알고리즘(BM25, Best Match 25)으로 검색하여 집계한 값</p>
                </div>
            </div>

            <div id='tooltip3' className={isCsnSmrltyTooltipShown ? 'tooltip-helper tooltip-helper-hover' : 'tooltip-helper'} style={{top: `-48px`, left: `62%`}}>
                <div className="flex-col">
                    <p>기술용어유사도</p>
                    <p>분과내 과제를 네트워크분석하여 추출한 '기술용어'와 평가위원 과제이력간 유사도(cosine similarity)를 집계한 값</p>
                </div>
            </div>
        </div>
    );
};

export default MbrTab;