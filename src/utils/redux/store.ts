
import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import refreshReducer from "./refreshSlice"
const Store = configureStore({
    reducer: {
        user: userReducer,
        refresh:refreshReducer
    }
})

export default Store;