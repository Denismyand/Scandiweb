import { configureStore } from "@reduxjs/toolkit";
import currencySlice from "./reducers/currencySlice";
import cartSlice from "./reducers/cartSlice";

export const store = configureStore({
  reducer: { currency: currencySlice, cart: cartSlice },
});
