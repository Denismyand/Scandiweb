import arrowDown from "../img/down-arrow.svg";
import arrowUp from "../img/up-arrow.svg";

export function Currency({
  currency,
  changeCurrency,
  showCurrencyDropdown,
  isCurrActive,
}) {
  return (
    <div className="currencySetting">
      <button
        className="currencyChoiserButton"
        onClick={() => showCurrencyDropdown()}
      >
        {currency.sign + " "}
        <img
          src={isCurrActive ? arrowUp : arrowDown}
          width="10px"
          height="10px"
          alt=""
        />
      </button>
      {isCurrActive && <CurrencyList changeCurrency={changeCurrency} />}
    </div>
  );
}

function CurrencyList({ changeCurrency }) {
  const currencies = [
    { label: "USD", symbol: "$" },
    { label: "GBP", symbol: "£" },
    { label: "AUD", symbol: "A$" },
    { label: "JPY", symbol: "¥" },
  ];
  return (
    <div className="currencyList">
      {currencies.map((currency) => (
        <p
          key={currency.label}
          onClick={() => {
            changeCurrency(currency.label, currency.symbol);
          }}
        >
          {currency.symbol + " " + currency.label}
        </p>
      ))}
    </div>
  );
}
