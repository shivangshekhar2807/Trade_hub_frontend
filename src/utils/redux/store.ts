
import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
const Store = configureStore({
    reducer: {
       user:userReducer
    }
})

export default Store;