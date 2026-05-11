import React, { useEffect, useState }from 'react';
import CondForm from './components/CondForm';
import CondTable from './components/CondTable';
import { condAction } from 'features/admin/cond/condReducer';
import { codeAction } from 'features/admin/code/codeReducer';
import { useDispatch, useSelector } from "react-redux";
import { notification, Modal} from "antd";


const CommCond = () => {
  const dispatch = useDispatch();

  const { condList, condListError, condDetail, condDetailError, insertCondState, updateCondState } = useSelector(
    ({ condReducer }) => ({
      condList: condReducer.condList,
      condDetail: condReducer.condDetail,
      insertCondState: condReducer.insertCondState.data,
      updateCondState: condReducer.updateCondState.data
    })
  );
  const { codeList } = useSelector(
    ({ codeReducer }) => ({
      codeList: codeReducer.codeList,
    })
  );

  const openNotification = (type, msg, desc) => {
    notification[type]({
      message: msg,
      description: desc,
      placement: "bottomRight"
    })
  }

  useEffect(() => {
    dispatch(codeAction.getCodeList({target: "codeList"}));
    dispatch(condAction.initialize('insertCondState'));
    dispatch(condAction.initialize('updateCondState'));
    dispatch(condAction.getCondList({ target: "condList" }));
  },[]);

  const [initialValues, setInitialValues] = useState();
  useEffect(() => {
    if (insertCondState) {
      if (insertCondState.state) {
        dispatch(condAction.getCondList({ target: "condList" }));
        dispatch(condAction.getCond({condKey: insertCondState.key}));
        openNotification('success', '추가되었습니다.');
      } else{
        const errorMessage = Object.keys(insertCondState.error).map((name) => insertCondState.error[name][0])[0];
        openNotification('error', errorMessage);
      }
      dispatch(condAction.initialize('insertCondState'));
    }},[insertCondState]);

  useEffect(() => {
    if (updateCondState) {
      if (updateCondState.state) {
        dispatch(condAction.getCondList({ target: "condList" }));
        openNotification('success', '수정되었습니다.');
      }  else {
        const errorMessage = Object.keys(updateCondState.error).map((name) => updateCondState.error[name][0])[0];
        openNotification('error', errorMessage);
      }
      dispatch(condAction.initialize('updateCondState'));
    }
  },[updateCondState])

  const [initialState, setInitialState] = useState({});
  const codeKey = ['CL008000000', 'CL009000000','CL010000000']
  useEffect(() => {
    if (codeList.data) {
      const children = codeList.data.children;
      const data = codeKey.map((code) => {
        return children.find(c => c.key === code).children.map((data) => ((
            {
              title: data.title,
              key: data.key,
              etcRmkCn1: data.etcRmkCn1 ? data.etcRmkCn1.split(",") : null
            }
          )))
      })
      setInitialState({
        sidoData: data[0],
        orgnData: data[1],
        degData: data[2]
      })
    }
  },[codeList.data]);

  const inputValidateHandler = (formData) => {
    const keys = Object.keys(formData).filter((key) => key !== 'excludeCond' );
    let valid = true;
    // const excludeCond = formData.excludeCond;
    // Object.keys(excludeCond).map((key) => {
    //   if (Array.isArray(excludeCond[key])) {
    //     if (excludeCond[key].length === 0) {
    //       valid = false;
    //     }
    //   } else {
    //     if (!excludeCond[key] || excludeCond[key] === '') {
    //       valid = false;
    //     }
    //   }
    // });
    keys.map((key) => {
      if (!formData[key] && key !== 'recoCondId') {
        valid = false;
      }
    })
    return valid;
  }

  const condInsertHandler = (formData) => {
    if (!inputValidateHandler(formData)) {
      return openNotification('warn', '필수 항목을 입력해주세요..');
    }
    Modal.confirm({
      title: '조건 추가',
      content: '해당 조건을 추가하시겠습니까?',
      okText: '확인',
      cancelText: '취소',
      onOk: () => {
        dispatch(condAction.insertCond(formData));
        setInsertFormVisible(false);
      }
    })
  }
  const condUpdateHandler = (formData) => {
    if (!inputValidateHandler(formData)) {
      return openNotification('warning', '필수 항목을 입력해주세요..');
    }
    Modal.confirm({
      title: '조건 수정',
      content: '해당 조건을 수정하시겠습니까?',
      okText: '확인',
      cancelText: '취소',
      onOk: () => {
        dispatch(condAction.updateCond(formData));       
      }
    })
  };



  useEffect(() => {
    if (condDetail.data) {
      setInitialValues(condDetail.data);
    }
  },[condDetail.data]);

  const formDataLayout = {
    recoCondId: null,
    recoCondNm: null,
    subjectCnt: null,
    evlMbrCnt: null,
    excludeCond: {
      orgnType: [],
      ['cmcarrSchs.degCd']: [],
      sido: [],
      sbjtCnt1y: null,
      excldCnt1y: null
    },
    useYn: 'Y'
  }

  const formResetHandler = () => {
    setInitialValues(formDataLayout);
  };

  const selectRowHandler = (key) => {
    dispatch(condAction.getCond({target: "condDetail", condKey: key}));
    formVisibleHandler();
    setInsertFormVisible(false);
  };
  const [formVisible, setFormVisible] = useState(false);
  const formVisibleHandler = () => setFormVisible(true);

  const [insertFormVisible, setInsertFormVisible] = useState(false);
  const insertFormVisibleHandler = () => {
    setInsertFormVisible(true);
    if (initialValues) {
      formResetHandler()
    };
  };
  return (
    <>
      <div className="grid-col-2 gap-16">
        <div className="grid-left p-0">
          <div className="flex-row items-center p-16 pb-0">
            <h4>자동배정 구성 조건</h4>
            <button
              type="button"
              className="btn-secondary-32 ml-auto"
              onClick={() => {
                insertFormVisibleHandler();
                formVisibleHandler();
              }}
              disabled={!condList.data}
            >추가하기</button>
          </div>
          <hr className="w-full mt-16 mb-0"/>
          <CondTable
            selectRowHandler={selectRowHandler}
            dataSource={condList.data}
            insertFormVisible={insertFormVisible}
          />
        </div>
        {formVisible &&
          <CondForm
            initialState={initialState}
            initialValues={initialValues}
            insertFormVisible={insertFormVisible}
            condUpdateHandler={condUpdateHandler}
            condInsertHandler={condInsertHandler}
            formDataLayout={formDataLayout}
          />
        }
      </div>
    </>

)
};

export default CommCond;