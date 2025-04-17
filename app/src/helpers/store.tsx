import { configureStore } from "@reduxjs/toolkit";
import contextReducer from "./slice"
export const store=configureStore({
    reducer:{
        context:contextReducer
    }
})


export type RootState=ReturnType<typeof store.getState>;