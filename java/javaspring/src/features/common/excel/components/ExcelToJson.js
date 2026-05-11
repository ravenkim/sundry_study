import React, { useEffect, useState } from 'react'

import * as XLSX from 'xlsx'
import {
  Alert,
  Button,
  Input,
  Modal,
  notification,
  Table,
  Tooltip,
  Upload,
} from 'antd'
import moment from 'moment'
import {
  EXCEL_UPLOAD_ERROR,
  EXCEL_UPLOAD_TYPE,
  EXCEL_UPLOAD_REQUIRED,
} from 'Constants'
import { nullToString } from 'utils/commonUtils'
import LimeModal from 'features/common/modal/LimeModal'
import Text from 'antd/es/typography/Text'
import { MonitorOutlined } from '@ant-design/icons'

const { Dragger } = Upload

const ExcelToJson = ({ excelLayout, setExcelJson }) => {
  const [excelData, setExcelData] = useState([])
  const [fileList, setFileList] = useState([])

  const [uploadError, setUploadError] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [warningRows, setWarningRows] = useState([])
  const [warningRowsMessage, setWarningRowMessage] = useState([])

  /**
   * Column 개수 validation handler
   * @param excelHeader
   * @returns {boolean}
   */
  const validateColumnsCount = (excelHeader) => {
    let valid = false
    if (excelHeader && excelHeader.length > 0) {
      if (excelHeader.length >= excelLayout.length) {
        // >= : 엑셀파일의 열은 오타에 의해 늘어 날수 있으므로 기준치보다 열이 많은 상황은 이상 없는것으로 간주
        valid = true
      }
    }
    return valid
  }

  /**
   * 엑셀데이터 검증 Handler
   * @param dataList
   */
  const validation = (headerAndDataList) => {
    // 검증상태 > true 면 검증성공, false면 검증실패
    let validateState = false
    // 검증에러 수
    let errorCount = 0
    // 결과값
    let result = []

    // 검증로직
    if (headerAndDataList && headerAndDataList.length > 0) {
      // data와 parameter로 넘긴 columns 수가 맞는지 검증
      validateState = validateColumnsCount(headerAndDataList[0])

      if (validateState) {
        let dataList = headerAndDataList.slice(15) //header제거
        let newArray = []
        let obj = {}
        let warningRowArray = []
        let warningRowMessage = []
        let columnLayout
        dataList.map((row, rowIndex) => {
          // row전체 공백체크

          let emptyValidArr = row.filter((col) => col && col)

          if (row && row.length > 0 && emptyValidArr.length > 0) {
            obj = {
              idx: rowIndex + 1,
              key: rowIndex,
            }

            row.map((col, colIndex) => {
              if (colIndex < excelLayout.length) {
                columnLayout = excelLayout[colIndex]
                //양식에 정의된 열(column) 항목 만큼만 데이터 처리합니다.이후는 무시...
                obj[columnLayout.dataIndex] = col
                //필수항목 여부 검사
                if (columnLayout.required === EXCEL_UPLOAD_REQUIRED.TRUE) {
                  if (nullToString(col).trim() === '') {
                    warningRowArray.push(rowIndex)
                    warningRowMessage.push({
                      rowKey: rowIndex,
                      message: `${rowIndex + 1}행 [${columnLayout.title}] ${
                        EXCEL_UPLOAD_ERROR.NOT_NULL
                      } [${col}]`,
                    })
                  }
                }
                //숫자 항목 유효성 확인
                if (columnLayout.type === EXCEL_UPLOAD_TYPE.INTEGER) {
                  if (typeof col === 'string') {
                    // 문자열에 , 가 포함되어있는경우 제거
                    let rplCol =
                      !col.indexOf(',') > -1
                        ? col.replace(/,/g, '').trim()
                        : col

                    // Number로 parsing이 안되면 Nan

                    if (isNaN(rplCol)) {
                      warningRowArray.push(rowIndex)
                      warningRowMessage.push({
                        rowKey: rowIndex,
                        message: `${rowIndex + 1}행 [${columnLayout.title}] ${
                          EXCEL_UPLOAD_ERROR.INTEGER_TYPE
                        } [${col}]`,
                      })
                    } else {
                      // data가 문자형이기 때문에 Number로 변환해서 다시 주입
                      obj[columnLayout.dataIndex] = Number(rplCol)
                    }
                  } else {
                    // 숫자와 문자열이 아닌 다른 type일때
                    warningRowArray.push(rowIndex)
                    warningRowMessage.push({
                      rowKey: rowIndex,
                      message: `${rowIndex + 1}행 [${columnLayout.title}] ${
                        EXCEL_UPLOAD_ERROR.INTEGER_TYPE
                      } [${col}]`,
                    })
                  }
                }
                //날짜 항목 유효성 확인
                if (columnLayout.type === EXCEL_UPLOAD_TYPE.DATE) {
                  if (!moment(col).isValid()) {
                    warningRowArray.push(rowIndex)
                    warningRowMessage.push({
                      rowKey: rowIndex,
                      message: `${rowIndex + 1}행 [${columnLayout.title}] ${
                        EXCEL_UPLOAD_ERROR.DATE_TYPE
                      } [${col}]`,
                    })
                  }
                }

                //크기 체크
                if (columnLayout.size > 0) {
                  if (columnLayout.type === EXCEL_UPLOAD_TYPE.INTEGER) {
                    //숫자인 경우 크기 체크
                    let targetData = col
                    if (typeof col !== 'number') {
                      if (typeof col === 'string') {
                        // 문자열에 , 가 포함되어있는경우 제거
                        let rplCol =
                          !col.indexOf(',') > -1
                            ? col.replace(/,/g, '').trim()
                            : col

                        // Number로 parsing이 되면
                        if (Number(rplCol)) {
                          targetData = Number(rplCol)
                        }
                      }
                    }
                    if (targetData >= Math.pow(10, columnLayout.size - 1)) {
                      warningRowArray.push(rowIndex)
                      warningRowMessage.push({
                        rowKey: rowIndex,
                        message: `${rowIndex + 1}행 [${columnLayout.title}] ${
                          EXCEL_UPLOAD_ERROR.INTEGER_SIZE
                        } [${col}]`,
                      })
                    }
                  } else if (columnLayout.type === EXCEL_UPLOAD_TYPE.STRING) {
                    //문자인 경우 길이 체크
                    if (col.length > columnLayout.size) {
                      warningRowArray.push(rowIndex)
                      warningRowMessage.push({
                        rowKey: rowIndex,
                        message: `${rowIndex + 1}행 [${columnLayout.title}] ${
                          EXCEL_UPLOAD_ERROR.STRING_LENGTH
                        } [${col}]`,
                      })
                    }
                  }
                }
              }

              //허용코드 체크
              if (
                columnLayout.allowedCode &&
                columnLayout.allowedCode.length > 0
              ) {
                if (!columnLayout.allowedCode.includes(col)) {
                  warningRowArray.push(rowIndex)
                  warningRowMessage.push({
                    rowKey: rowIndex,
                    message: `${rowIndex + 1}행 [${columnLayout.title}] ${
                      EXCEL_UPLOAD_ERROR.ALLOWED_CODE
                    } [${col}]`,
                  })
                }
              }
            })
            newArray.push(obj)
          }
        })
        // if (DEBUG) console.log("newArray : ", newArray);

        if (warningRowArray.length > 0) {
          errorCount = warningRowArray.length
        }
        result = newArray
        setExcelData(newArray)
        setWarningRows(warningRowArray)
        setWarningRowMessage(warningRowMessage)
      } else {
        errorCount = 1
        notification.error({
          message: EXCEL_UPLOAD_ERROR.COLUMN_COUNT,
          duration: 5,
          placement: 'bottomRight',
        })
      }
    }
    return {
      state: validateState,
      errorCount: errorCount,
      result: result,
    }
  }

  /**
   * 검증된 데이터 처리 Handler
   * @param dataList
   */
  const excelToJsonHandler = (dataList, fileName, sheetName) => {
    let validationResult = validation(dataList)

    if (validationResult.errorCount === 0) {
      notification.success({
        message: '엑셀 파일 읽기와 데이터 검증을 완료했습니다.',
        duration: 3,
        placement: 'bottomRight',
      })
      setUploadError(false)
      setExcelJson({
        result: validationResult.result,
        fileName: fileName,
        sheetName: sheetName,
      })
    } else {
      Modal.error({
        title: '오류 발생',
        content: '엑셀 파일 데이터 검증 시 오류가 발생 되었습니다.',
        okText: '확인',
        getContainer: false,
      })
      setUploadError(true)
      setExcelJson({ result: [], fileName: '', sheetName: '' })
    }
  }

  /**
   * Excelfile read handler
   * @param event
   * @returns {Promise<void>}
   */
  const asyncReadExcelFileHandler = async (event) => {
    let tmpList = event.fileList.filter((file) => !!file.status)
    setFileList(tmpList)
    let fileName = ''
    let sheetName = ''
    if (tmpList.length > 0 && tmpList.length < 2) {
      fileName = tmpList[0].name
    }

    await new Promise((resolve, reject) => {
      if (
        tmpList &&
        tmpList.length > 0 &&
        event.event &&
        event.event.percent === 100
      ) {
        const fileReader = new FileReader()
        // setTableLoading(true);
        fileReader.readAsArrayBuffer(event.file.originFileObj)

        fileReader.onload = function (e) {
          const bufferArray = e.target.result
          const wb = XLSX.read(bufferArray, { type: 'buffer' })
          const wsname = wb.SheetNames[0]
          sheetName = wsname
          const ws = wb.Sheets[wsname]

          //header별도 0번째 행으로 출력하고 이후 데이터는 row별 배열로 컬럼을 표시 , raw : false => 값을 문자열로 가져온다. raw : true => 값을 datatype에 맞춰 가져온다.
          const data = XLSX.utils.sheet_to_json(ws, {
            header: 1,
            raw: false,
            defval: '',
          })
          resolve(data)
        }
      }
    })
      .then((tmpData) => {
        // 확장자 제거후 파일이름만 반환
        fileName = fileName.trim().replace(/(.xls|.xlsx)$/, '')
        excelToJsonHandler(tmpData, fileName, sheetName)
      })
      .catch((exception) => {
        alert('엑셀 파일을 읽는중 오류가 발생했습니다.')
      })
    // .finally(() => {
    //   setTableLoading(false);
    // });
  }

  const deleteFileHandler = () => {
    setExcelData([])
    setFileList([])
    setUploadError(false)
  }

  /**
   * EXCEL 정보 모달
   */
  const [excelModalVisible, setExcelModalVisible] = useState(false)

  const moveRowHandler = (rowKey) => {
    document.getElementById('excelRow_' + (Number(rowKey) + 1)).focus()
  }

  return (
    <>
      {fileList && fileList.length > 0 && excelData.length > 0 && (
        <div className="file-upload">
          <p>
            <Tooltip title={'업로드 내용 확인하기'} placement={'bottom'}>
              <div className="file-content">
                <div className="file-list-one">
                  <span className="mdi mdi-file-document-outline text-primary text-icon-16"></span>
                   <span
                     style={{ cursor: 'pointer', color: uploadError ? 'red' : '' }}
                     onClick={() => {
                       setExcelModalVisible(true)
                     }}
                   >
                      {fileList[0].name}
                    </span>
                  <input type="text" id="fileName2" readOnly/>
                  <button type="button" className="btn-system-red-32" onClick={deleteFileHandler}>삭제</button>
                </div>
              </div>
            </Tooltip>
          </p>
          {excelData && (
            <LimeModal
              visible={excelModalVisible}
              title={'엑셀 업로드 내용'}
              closeHandler={() => setExcelModalVisible(false)}
              className="modal-large-preview"              
              style={{ width: "fit-content", height: "fit-content", maxHeight: "599px", left: "0", top: "-64px", transform: "none" }}
            >
              <Alert
                message={`업로드 오류 ( ${
                  warningRowsMessage && warningRowsMessage.length
                } )건`}
                type={
                  warningRowsMessage && warningRowsMessage.length > 0
                    ? 'error'
                    : 'success'
                }
                showIcon
                closable={false}
                description={
                  <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    {warningRowsMessage &&
                      warningRowsMessage.map((msg, index) => {
                        return (
                          <div key={index}>
                            <Text type="danger">{msg.message}</Text>

                            <Button
                              icon={<MonitorOutlined/>}
                              size={'small'}
                              type={'link'}
                              style={{ fontSize: '12px' }}
                              onClick={(e) => moveRowHandler(msg.rowKey)}
                            >
                              바로가기
                            </Button>
                          </div>
                        )
                      })}
                  </div>
                }
              />
              <Table
                // loading={tableLoading}
                showHeader={true}
                columns={[
                  {
                    title: '번호',
                    dataIndex: 'idx',
                    width: 80,
                    align: 'center',
                    render: (rnum) => (
                      <input
                        style={{
                          marginLeft: '5px',
                          width: 50,
                          textAlign: 'center',
                        }}
                        id={'excelRow_' + rnum}
                        size={'small'}
                        className={'span_input'}
                        readOnly
                        defaultValue={rnum}
                      />
                    ),
                  },
                  ...excelLayout,
                ]}
                dataSource={excelData && excelData}
                // loading={tableLoading}
                size="small"
                tableLayout={'auto'}
                scroll={{ y: 300, x: 1000 }}
                // onRow={(record, rowIndex) => {
                //   return {
                //     onClick: (event) =>
                //       onRowClickHandler && onRowClickHandler(record.blltSeq),
                //     style: { cursor: "pointer" },
                //   };
                // }}

                bordered={true}
                pagination={false}
              />
            </LimeModal>
          )}
        </div>
      )}

      <Dragger
        style={
          fileList && fileList.length > 0 && excelData.length > 0
            ? { display: 'none' }
            : null
        }
        fileList={fileList}
        multiple={false}
        showUploadList={false}
        beforeUpload={(file) => {
          console.log(
            'file : ',
            file.name.replace(/\s/gi, '').replace('.xlsx', '')
          )

          setUploadError(false)
          setExcelData([])
          setFileList([])
          if (
            file.type !==
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          ) {
            Modal.error({ content: 'xlsx확장자만 허용됩니다' })
            return false
          }

          if (
            file.name.replace(/\s/gi, '').replace('.xlsx', '') ===
            '과제업로드양식'
          ) {
            Modal.error({ content: '파일명에 사업명을 입력해주세요' })
            return false
          }
        }}
        onChange={asyncReadExcelFileHandler}
      >
        <div className="file">
          <span className="mdi mdi-file-upload-outline"></span>
          <p className="text-14-m">파일 업로드</p>
        </div>
      </Dragger>
    </>
  )
}

export default ExcelToJson
