import { createSlice } from "@reduxjs/toolkit";

const chooseModeSlice = createSlice({
    name: "chooseMode",
    initialState: 0,
    reducers: {
        chooseCanvas: () => 0,
        chooseCode: () => 1,
    },
})

export const {
    chooseCanvas,
    chooseCode,
} = chooseModeSlice.actions

export default chooseModeSlice.reducer