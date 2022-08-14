import { currencyInfo } from "../types";

type Currency = changeCurrency | currencyDropdown;

type changeCurrency = {
  type: "changeCurrency";
  payload: currencyInfo;
};
type currencyDropdown = {
  type: "currencyDropdown";
};

const currency: currencyInfo = {
  label: "USD",
  symbol: "$",
  isActive: false,
};

export const currencyReducer = (state = currency, action: Currency) => {
  switch (action.type) {
    case "changeCurrency": {
      return action.payload;
    }
    case "currencyDropdown": {
      return { ...state, isActive: !state.isActive };
    }
    default: {
      return state;
    }
  }
};
