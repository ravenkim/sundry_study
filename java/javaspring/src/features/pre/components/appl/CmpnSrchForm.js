import React, { useState } from 'react';
import locale from "antd/es/date-picker/locale/ko_KR";
import moment from 'moment';
import { DatePicker, Select } from "antd";
const { RangePicker } = DatePicker;
const { Option } = Select;

const CmpnSrchForm = (
  {
    searchHandler,
    searchWord,
    searchWordChangeHandler,
    cmpnList,
    orgnIdChangeHandler,
  }
) => {

  const [formData, setFormData] = useState({
    orgnId: null,
    date: [moment('2022-01-01'), moment('2022-12-31')],
  });

  const dateChangeHandler = (value) => {
    if (value && value.length === 2) {
      const date = value.map((data) => moment(data).format('YYYY-MM-DD'))
      setFormData((prevState) => ({
        ...prevState,
        date: date
      }));
    }
  };

  const onPressEnter = (e) => {
    if (e.key === 'Enter' && formData.orgnId) {
      searchHandler(formData);
    }
  };

  return (
    <div className="p-16 flex-col gap-16 h-contsize">
      <div className="grid-col-6">
        <div className="form-label-text">사업기간</div>

        <div className="ant-datepicker col-span-5">
          <RangePicker
            locale={locale}
            allowEmpty={[false, false]}
            format={'YYYY/MM/DD'}
            onChange={dateChangeHandler}
            defaultValue={formData.date}
          />
        </div>
      </div>
      <div className="grid-col-6">
        <div className="form-label-text">업체명</div>
        <Select
          showSearch
          allowClear
          suffixIcon={false}
          placeholder={'업체명을 2글자 이상 입력해주세요.'}
          optionFilterProp={"children"}
          filterOption={(input, option) => option.children.includes(input)}
          filterSort={(optionA, optionB) =>
            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
          }
          className={'col-span-5'}
          searchValue={searchWord}
          onSearch={(value) => searchWordChangeHandler(value)}
          onChange={(value, e) => {
            setFormData((prevState) => ({
              ...prevState,
              orgnId: e ? e.key : null
            }))
            orgnIdChangeHandler(e ? e.key : null);
          }
          }
          notFoundContent={'검색어가 포함된 업체가 없습니다.'}
          onInputKeyDown={(e) => onPressEnter(e)}
        >
          {cmpnList && searchWord.length >= 2 &&
            cmpnList.map((cmpn) => (
              <Option key={cmpn.ORGN_ID} value={cmpn.ORGN_NM}>{cmpn.ORGN_NM}</Option>
            ))
          }
        </Select>
      </div>
      <button
        type="button"
        className="btn-secondary-48 w-full mt-8"
        onClick={() => searchHandler(formData)}
      >조회하기</button>
    </div>
  )
};
export default CmpnSrchForm;