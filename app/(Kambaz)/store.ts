import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./Courses/reducer";
import modulesReducer from "./Courses/[cid]/Modules/reducer";
const store = configureStore({
    reducer: { coursesReducer, modulesReducer },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;