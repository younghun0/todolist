import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./conunterSlice";

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});
export default store;
