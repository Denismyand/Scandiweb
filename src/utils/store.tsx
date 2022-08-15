import { configureStore } from "@reduxjs/toolkit";
import currencySlice from "./reducers/currencyReducer";
import { cartReducer } from "./reducers/cartReducer";

export const store = configureStore({
  reducer: { currency: currencySlice, cart: cartReducer },
});
