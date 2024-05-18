import { configureStore } from "@reduxjs/toolkit";
import AuthSliceReducer from "./Slices/AuthSlice.js";

import CourseSliceReducer from "./Slices/CourseSlice.js";

const store = configureStore({
  //    Redux Toolkit Initalization

  reducer: {
    auth: AuthSliceReducer,
    course: CourseSliceReducer,
  }, //  root reducer (like in combineReducers
  devTools: true, //   enables Redux Devtools Extension
});

export default store;
