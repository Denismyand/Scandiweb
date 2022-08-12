const currency = {
  label: "USD",
  symbol: "$",
  isActive: false,
};

export const currencyReducer = (state = currency, action) => {
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
