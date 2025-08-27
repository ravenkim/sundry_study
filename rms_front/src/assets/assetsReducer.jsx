import {createSlice} from "@reduxjs/toolkit";
import {basicTheme} from "src/assets/colors/colors.jsx";


const prefix = 'assets'


const initialState = {
    colors: basicTheme
}







export const assetsSlice = createSlice(
    {
        name: prefix,
        initialState: initialState,
        reducers: {

        },
    }
)
