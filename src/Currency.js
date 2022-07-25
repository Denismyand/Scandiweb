import arrowDown from "./img/down-arrow.svg";
import arrowUp from "./img/up-arrow.svg";

export function Currency({
  currencySign,
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
        {currencySign + " "}
        <img
          src={isCurrActive ? arrowUp : arrowDown}
          width="10px"
          height="10px"
          alt=""
        />
      </button>
      {isCurrActive ? <CurrencyList changeCurrency={changeCurrency} /> : null}
    </div>
  );
}

function CurrencyList({ changeCurrency }) {
  return (
    <div className="currencyList">
      <p
        onClick={() => {
          changeCurrency("USD", "$");
        }}
      >
        $ USD
      </p>
      <p
        onClick={() => {
          changeCurrency("GBP", "£");
        }}
      >
        £ GBP
      </p>
      <p
        onClick={() => {
          changeCurrency("AUD", "A$");
        }}
      >
        A$ AUD
      </p>
      <p
        onClick={() => {
          changeCurrency("JPY", "¥");
        }}
      >
        ¥ JPY
      </p>
    </div>
  );
}
