import arrowDown from "../img/down-arrow.svg";
import arrowUp from "../img/up-arrow.svg";
import { useDispatch, useSelector } from "react-redux";

export function Currency() {
  const dispatch = useDispatch();

  const currency = useSelector((state) => state.currency);

  function showCurrencyDropdown() {
    dispatch({ type: "DROPDOWN", payload: currency });
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
          src={currency.isActive ? arrowUp : arrowDown}
          width="10px"
          height="10px"
          alt=""
        />
      </button>
      {currency.isActive && <CurrencyList />}
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
  function changeCurrency(currency) {
    dispatch({ type: "CHANGE", payload: currency });
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
