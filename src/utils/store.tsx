import { configureStore } from "@reduxjs/toolkit";
import { currencyReducer } from "./reducers/currencyReducer";
import { cartReducer } from "./reducers/cartReducer";

export const store = configureStore({
  reducer: { currency: currencyReducer, cart: cartReducer },
});
