const currency = {
  label: "USD",
  symbol: "$",
  isActive: false,
};

export const currencyReducer = (state = currency, action) => {
  switch (action.type) {
    case "CHANGE": {
      return action.payload;
    }
    case "DROPDOWN": {
      return { ...state, isActive: !action.payload.isActive };
    }
    default: {
      return state;
    }
  }
};
