import React from "react";
import arrowDown from "../img/down-arrow.svg";
import arrowUp from "../img/up-arrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { PricesInfo } from "../utils/types";

export function Currency() {
  const dispatch = useDispatch();

  const currency = useSelector((state: PricesInfo) => state.currency);
  const currencyIsActive = useSelector(
    (state: PricesInfo) => state.currency.isActive
  );

  function showCurrencyDropdown() {
    dispatch({ type: "currencyDropdown", payload: "" });
  }

  return (
    <div className="currencySetting">
      <button
        className="currencyChoiserButton"
        onClick={(e) => {
          e.stopPropagation();
          showCurrencyDropdown();
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
  function changeCurrency(currency: object) {
    dispatch({ type: "changeCurrency", payload: currency });
  }

  return (
    <div className="currencyList">
      {currencies.map((currency) => (
        <p
          key={currency.label}
          onClick={(e) => {
            e.stopPropagation();
            changeCurrency(currency);
          }}
        >
          {currency.symbol + " " + currency.label}
        </p>
      ))}
    </div>
  );
}
