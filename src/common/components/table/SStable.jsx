import React, {useEffect} from 'react';
import {Table} from "antd";
import SSsearchInput from "../input/SSsearchInput.jsx";

/*
ex

columns




dataSource
[
    {
        name: 해준,
        team: front,
        age: 27,
    },
    {
        name: 민교,
        team: back,
        age: ??,
    },
    {
        name: 찬민,
        team: front,
        age: 28,
    },
    {
        name: 소현,
        team: back,
        age: 28,
    },
    {
        name: 효진,
        team: back,
        age: 23,
    },
]

*/





const SStable = ({
    useSearch = false,

    useIndex = false,
    columns,
    dataSource,




                 }) => {












    return (
        <>


            <SSsearchInput/>



            <Table/>
        </>
    );
};

export default SStable;
