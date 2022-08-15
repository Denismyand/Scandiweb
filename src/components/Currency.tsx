import React from "react";
import arrowDown from "../img/down-arrow.svg";
import arrowUp from "../img/up-arrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { PricesInfo } from "../utils/types";
import {
  changeCurrency,
  currencyDropdown,
} from "../utils/reducers/currencySlice";

export function Currency() {
  const dispatch = useDispatch();

  const currency = useSelector((state: PricesInfo) => state.currency);
  const currencyIsActive = useSelector(
    (state: PricesInfo) => state.currency.isActive
  );
  return (
    <div className="currencySetting">
      <button
        className="currencyChoiserButton"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(currencyDropdown());
        }}
      >
        {currency.symbol + " "}
        <img
          src={currencyIsActive ? arrowUp : arrowDown}
          width="10px"
          height="10px"
          alt=""
        />
      </button>
      {currencyIsActive && <CurrencyList />}
    </div>
  );
}

function CurrencyList() {
  const currencies = [
    { label: "USD", symbol: "$", isActive: false },
    { label: "GBP", symbol: "£", isActive: false },
    { label: "AUD", symbol: "A$", isActive: false },
    { label: "JPY", symbol: "¥", isActive: false },
  ];

  const dispatch = useDispatch();

  return (
    <div className="currencyList">
      {currencies.map((currency) => (
        <p
          key={currency.label}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(changeCurrency(currency));
          }}
        >
          {currency.symbol + " " + currency.label}
        </p>
      ))}
    </div>
  );
}
