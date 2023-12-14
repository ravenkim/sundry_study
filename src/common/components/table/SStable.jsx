import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import SSsearchInput from "../input/SSsearchInput.jsx";
import hangul from 'hangul-js';
import Highlighter from 'react-highlight-words';


/*
ex

columns


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
                     useSearch = false,

                     useIndex = false,
                     columns,
                     dataSource,


                 }) => {


    const [searchText, setSearchText] = useState('')
    const [filteredData, setFilteredData] = useState([])


    useEffect(() => {
        if (dataSource) {
            if (searchText.trim() === '') {
                setFilteredData(dataSource)
            } else {
                const filtered = dataSource.filter(item => {


                    const itemValues = hangul.disassemble(Object.values(item).join(' ').toLowerCase()).join('');
                    const searchTextProcessed = hangul.disassemble(searchText.toLowerCase()).join('');
                    return itemValues.includes(searchTextProcessed);
                });
                setFilteredData(filtered)
            }
        }

    }, [searchText, dataSource])


    const [featuresColumns, setFeaturesColumns] = useState([])


    useEffect(() => {
        setFeaturesColumns(
            columns.map(item => {

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

    }, [columns, filteredData]);


    useEffect(() => {
        console.log(filteredData)

    }, [filteredData]);


    return (
        <>


            <SSsearchInput

                value={searchText}
                onChange={e => setSearchText(e.target.value)}


            />


            <Table
                className={'mt-[16px]'}
                dataSource={filteredData}
                columns={featuresColumns}
            />
        </>
    );
};

export default SStable;
