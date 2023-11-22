import React, {useEffect, useState} from 'react';
import LimeModal from "features/common/modal/LimeModal";
import LimeRadarChart from "features/chart/components/LimeRadarChart";
import {Spin, Tooltip} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {evaluatorAction} from "features/evaluator/evaluatorReducer";
import LimeWordCloud from "features/chart/components/LimeWordCloud";

const CATEGORY_DICT = {
    E100000 : "E100000_기계ㆍ소재",
    E200000 : "E200000_전기ㆍ전자",
    E300000 : "E300000_정보통신",
    E400000 : "E400000_화학",
    E500000 : "E500000_바이오ㆍ의료",
    E600000 : "E600000_에너지ㆍ자원",
    E700000 : "E700000_지식서비스",

}

const MbrDetailModal = ({cmitDetail, mbrDetail, modalVisible, modalCloseHandler}) => {

    const dispatch = useDispatch();

    const {
        cmitMbrDetail,
        cmitMbrDetailLoading,
    } = useSelector(({evaluatorReducer}) => ({
        cmitMbrDetail: evaluatorReducer.cmitMbrDetail.data,
        cmitMbrDetailLoading: evaluatorReducer.cmitMbrDetail.loading,

    }));

    useEffect(() => {
        if (cmitMbrDetail) {
            setSbjtHistList(cmitMbrDetail.sbjtHistList);
            setWordcloudData(cmitMbrDetail.wordcloud && cmitMbrDetail.wordcloud.length > 0 ? cmitMbrDetail.wordcloud : []);

        }
    }, [cmitMbrDetail])

    const [radarData, setRadarData] = useState();
    const [tableDataSource, setTableDataSource] = useState([]);
    const [sbjtHistList, setSbjtHistList] = useState([]);
    const [itcFitness, setItcFitness] = useState(0);
    const [wordcloudData, setWordcloudData] = useState([]);

    const [activeTab, setActiveTab] = useState();
    const tabChangeHandler = (tab) => {
        setActiveTab(tab);
    }

    /**
     * 분석 API가 전달해주는 카테고리 수가 맞지않을때 Data converting하는 handler
     * @param itcPredict
     * @returns {{}}
     */
    const predictConvertingHandler = (itcPredict) => {

        let categoryKeys = Object.keys(CATEGORY_DICT);

        let predictKeys = Object.keys(itcPredict);

        let returnObject = {}
        categoryKeys.forEach((categoryKey)=>{
            predictKeys.forEach((predictKey)=>{
              if(categoryKey === predictKey){
                  returnObject = {
                      ...returnObject,
                      [CATEGORY_DICT[categoryKey]] : itcPredict[predictKey],
                  }
              }else{
                  returnObject = {
                      ...returnObject,
                      [CATEGORY_DICT[categoryKey]] : 0
                  }
              }
            })
        })
        return returnObject
    }

    const createRadarChartDataHandler = () => {
        let cmitPredict = JSON.parse(cmitDetail.itcPredict)[0];
        let mbrPredict = JSON.parse(mbrDetail.itcPredict)[0];

        if(Object.keys(cmitPredict).length!==7){
            cmitPredict = predictConvertingHandler(cmitPredict);
        }

        if(Object.keys(mbrPredict).length!==7){
            mbrPredict = predictConvertingHandler(mbrPredict);
        }

        setItcFitness((mbrDetail.itcFitness * 100).toFixed(2));

        let tableData = [];

        let cmitValues = [];
        let mbrValues = [];

        let labelList = Object.keys(cmitPredict);

        // 대분류가 7개값이 전부 안왔을때 처리


        let labelNameList = [];
        labelList.forEach((item) => {
            cmitValues.push(cmitPredict[item]);
            mbrValues.push(mbrPredict[item]);

            let label = "이름없음";
            let nameList = item.split("_");

            if (nameList.length === 2) {
                label = nameList[1]
            }

            labelNameList.push(label);


            tableData.push({
                cdNm: label,
                cmit: cmitPredict[item],
                mbr: mbrPredict[item]
            })
        })

        // 라벨이름 수정


        let cmitDataSource = {
            value: cmitValues,
            name: "분과",
            color: "orange"
        }

        let mbrDataSource = {
            value: mbrValues,
            name: mbrDetail.source.mbrNm,
            color: "blue"
        }

        setRadarData({
            dataSource: [cmitDataSource, mbrDataSource],
            label: labelNameList,
        });

        setTableDataSource(tableData);
    }

    useEffect(() => {
        if (cmitDetail && mbrDetail) {
            setActiveTab(1);
            dispatch(evaluatorAction.getCmitMbrDetail({mbrId: mbrDetail.mbrId}));

            createRadarChartDataHandler();

        }
    }, [mbrDetail])



    useEffect(()=>{
        if(activeTab===1 && mbrDetail && cmitDetail){
            createRadarChartDataHandler();
        }
    },[activeTab]);



    useEffect(() => {
        if (!modalVisible) {
            setActiveTab();
        }else{
            setActiveTab(1);
        }
    }, [modalVisible])


    return (
        <LimeModal className={"modal-large-table"} title={"평가위원 상세정보"} titleClassName={"flex-row items-center"}
                   visible={modalVisible} closeHandler={modalCloseHandler}>
            <table className="table-info">
                <tbody>
                <tr>
                    <th className="ptb-8">평가위원</th>
                    <td colSpan="2" className="ptb-8">{mbrDetail.source.mbrNm}</td>
                    <th className="ptb-8">소속기관</th>
                    <td colSpan="2">{mbrDetail.source.orgnNm}</td>
                </tr>
                <tr>
                    <th className="ptb-8">기술분류</th>
                    <td className="ptb-8">{mbrDetail.source.docSubclassNm}</td>
                    <th className="ptb-8">기술용어 유사도</th>
                    <td className="ptb-8">{mbrDetail.csnSmrlty}</td>
                    <th className="ptb-8">과제<br/>관련도</th>
                    <td className="ptb-8">{mbrDetail.score}</td>
                </tr>
                <tr>
                    <th className="ptb-8">평가성과<br/>(최근 5년 성공률)</th>
                    <td className="ptb-8">{mbrDetail.source.scssPcnt5y} %</td>
                    <th className="ptb-8">평가횟수<br/>(최근 1년)</th>
                    <td className="ptb-8">{mbrDetail.source.sbjtCnt1y} 회</td>
                    <th className="ptb-8">5년 누적<br/>평가 회수</th>
                    <td className="ptb-8">{mbrDetail.source.evalCnt5y}</td>
                </tr>
                </tbody>
            </table>
            <hr className="mtb-16 w-full"/>

            <div className="grid-col-3 gap-16">
                <div className="col-span-2">
                    {activeTab === 1 ?
                        <>
                            <h4 className="mb-16">{cmitDetail && cmitDetail.cmitNm}</h4>
                            <div style={{height: "467px"}}>
                                <h3 className="text-center">
                                    {
                                        radarData &&
                                        <LimeRadarChart dataSource={radarData.dataSource} label={radarData.label}
                                                        size={[596, 467]} range={100}/>

                                    }
                                </h3>
                            </div>
                        </>
                        :
                        <Spin spinning={cmitMbrDetailLoading}>
                            <LimeWordCloud dataSource={wordcloudData} size={[596, 467]}/>
                        </Spin>
                    }


                </div>

                <div className="col-span-1">
                    <div className="flex-row gap-8 mb-8">
                        <div className="tabs">
                            <button type="button"
                                    className={`contents-tab ${activeTab === 1 ? "active-contents-tab" : ""}`}
                                    onClick={() => tabChangeHandler(1)}>분과 적합도
                            </button>
                        </div>
                        <div className="tabs">
                            <button
                                type="button"
                                className={`contents-tab ${activeTab === 2 ? "active-contents-tab" : ""}`}
                                onClick={() => tabChangeHandler(2)}
                                disabled={cmitMbrDetailLoading}
                            >
                                <Spin spinning={cmitMbrDetailLoading} >
                                    평가 과제 이력
                                </Spin>
                            </button>
                        </div>
                    </div>

                    <div className="border-1 border-gray-200">
                        <div className="table-wrap m-0" style={{height: "416px"}}>
                            {activeTab === 1 ?
                                <table className="striped">
                                    <colgroup>
                                        <col width="27%"/>
                                        <col width="22%"/>
                                        <col width="22%"/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th>기술분류</th>
                                        <th className="text-center">분과</th>
                                        <th className="text-center">평가위원</th>
                                    </tr>
                                    </thead>
                                    <tbody id="tbody-for4">
                                    {
                                        tableDataSource.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>

                                                    <Tooltip zIndex={10002} title={item.cdNm}>
                                                        <label>
                                                            {item.cdNm}
                                                        </label>
                                                    </Tooltip>
                                                </td>
                                                <td className="text-center">{item.cmit}</td>
                                                <td className="text-center">{item.mbr}</td>
                                            </tr>
                                        ))
                                    }


                                    </tbody>
                                </table>
                                :

                                <table className="striped">
                                    <colgroup>
                                        <col width="10%"/>
                                        <col width="55%"/>
                                        <col width="35%"/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th className="text-center"></th>
                                        <th className="text-center">과제명</th>
                                        <th className="text-center">평가연도</th>
                                    </tr>
                                    </thead>
                                    <tbody id="tbody-for4">
                                    {
                                        sbjtHistList.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="text-center">{idx + 1}</td>
                                                <td>
                                                    <Tooltip placement="topLeft" zIndex={10002} title={item.sbjtNm}>
                                                        <label>
                                                            {item.sbjtNm}
                                                        </label>
                                                    </Tooltip>
                                                </td>
                                                <td>
                                                    <Tooltip zIndex={10002} title={item.evalYy}>
                                                        <label>
                                                            {item.evalYy}
                                                        </label>
                                                    </Tooltip>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>
                            }

                        </div>

                        <div className="frame-top-border bg-light-blue flex-row items-center plr-16 ptb-8">
                            <p className="text-14-m">평가위원 분과 적합도</p>
                            <h4 className="text-primary font-bold-500 ml-auto mr-24">{itcFitness}<span
                                className="ml-4 text-16 font-bold-500">%</span></h4>
                        </div>
                    </div>
                </div>
            </div>
        </LimeModal>
    );
};

export default MbrDetailModal;