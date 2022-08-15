import { CurrencyInfo } from "../types";
import { createSlice } from "@reduxjs/toolkit";

const currency: CurrencyInfo = {
  label: "USD",
  symbol: "$",
  isActive: false,
};

const currencySlice = createSlice({
  name: "currency",
  initialState: currency,
  reducers: {
    changeCurrency(state: CurrencyInfo, action: { payload: CurrencyInfo }) {
      return (state = action.payload);
    },
    currencyDropdown(state) {
      return (state = { ...state, isActive: !state.isActive });
    },
  },
});

export default currencySlice.reducer;
export const { changeCurrency, currencyDropdown } = currencySlice.actions;
