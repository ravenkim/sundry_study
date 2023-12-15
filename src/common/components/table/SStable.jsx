import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import SSsearchInput from "../input/SSsearchInput.jsx";
import hangul from 'hangul-js';
import Highlighter from 'react-highlight-words';


/*
ex

columns = [
    {
        searchAllow,


    },
]


*/


// const dataSource = [
//      {
//         name: '해준',
//         team: 'front',
//         age: 27,
//     },
//     {
//         name: '민교',
//         team: 'back',
//         age: '??',
//     },
//     {
//         name: '찬민',
//         team: 'front',
//         age: '28',
//     },
//     {
//         name: 'soyyye',
//         team: 'back',
//         age: 28,
//     },
//     {
//         name: '효진',
//         team: 'back',
//         age: 23,
//     },
// ]


const SStable = ({
                     useSearch = true,

                     useIndex = false,
                     columns,
                     dataSource,

                 }) => {

   /*
       데이터 처리기능
   */



    //1. 빠른 정렬을 위해 key추가
    const [keyAddDataSource, setKeyAddDataSource] = useState()

    useEffect(() => {
        if (dataSource) {
            setKeyAddDataSource(dataSource.map((d, index) => ({...d, key: index + 1})))
        }
    }, [dataSource]);


    //검색기능 추가
    const [searchText, setSearchText] = useState('') //입력값
    const [filteredData, setFilteredData] = useState([]) //검색되고 남은 값들


    useEffect(() => {
        if (keyAddDataSource) {
            if (searchText.trim() === '') {
                setFilteredData(keyAddDataSource)
            } else {
                const filtered = keyAddDataSource.filter(item => {


                    const itemValues = hangul.disassemble(Object.values(item).join(' ').toLowerCase()).join('');
                    const searchTextProcessed = hangul.disassemble(searchText.toLowerCase()).join('');
                    return itemValues.includes(searchTextProcessed);
                })
                setFilteredData(filtered)
            }
        }

    }, [searchText, keyAddDataSource])







    /*
    colums 관리
    */


     const [indexColumns, setIndexColumns] = useState([])


    //1. index 추가 기능
    useEffect(() => {
        if (columns) {
            if (useIndex) {
                const olumnsWithNo = [
                    {
                        title: 'No',
                        dataIndex: 'key',
                    },
                ]
                setIndexColumns([
                    ...olumnsWithNo,
                    ...columns
                ])
            } else {
                setIndexColumns(columns)
            }
        }

    }, [columns]);




    //2. 검색시 하이라이트 기능
    const [colorFeaturesColumns, setColorFeaturesColumns] = useState([])


    useEffect(() => {


        setColorFeaturesColumns(
            indexColumns.map(item => {
                return {
                    render: text => (
                        <Highlighter
                            highlightStyle={{backgroundColor: 'yellow', padding: 0}}
                            searchWords={[searchText]}
                            autoEscape
                            textToHighlight={text ? text.toString() : ''}
                        />

                    ),
                    ...item
                }

            })
        )

    }, [indexColumns, filteredData]);


    return (
        <>

            {useSearch &&
                <SSsearchInput

                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}


                />}


            <Table
                size={"small"}
                className={'mt-[16px]'}
                dataSource={filteredData}
                columns={colorFeaturesColumns}
            />
        </>
    );
};

export default SStable;
