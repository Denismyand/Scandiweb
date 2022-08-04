import { Currency } from "./Currency.js";
import { MiniCart } from "./MiniCart.js";
import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import shopLogo from "../img/logo.svg";
import { useCategories } from "../utils/request.js";

export function MainOverlay({
  isCurrActive,
  showCurrencyDropdown,
  cart,
  currency,
  setCurrency,
  getCartQuantity,
  getPercentOfCartTotal,
  handleSelectAttribute,
  handleProductIsInCart,
  handleDecreaseCartQuantity,
}) {
  const [miniCartActive, setMiniCartActive] = useState(false);

  function changeCurrency(curr, currSign) {
    setCurrency({ label: curr, sign: currSign });
  }

  function showMiniCart() {
    setMiniCartActive(!miniCartActive);
  }
  return (
    <>
      <Header
        cart={cart}
        currency={currency}
        changeCurrency={changeCurrency}
        showCurrencyDropdown={showCurrencyDropdown}
        isCurrActive={isCurrActive}
        showMiniCart={showMiniCart}
        getCartQuantity={getCartQuantity}
      />
      {miniCartActive && (
        <MiniCart
          showMiniCart={showMiniCart}
          cart={cart}
          currency={currency}
          getCartQuantity={getCartQuantity}
          getPercentOfCartTotal={getPercentOfCartTotal}
          handleSelectAttribute={handleSelectAttribute}
          handleProductIsInCart={handleProductIsInCart}
          handleDecreaseCartQuantity={handleDecreaseCartQuantity}
        />
      )}
      <Outlet />
    </>
  );
}

function Header({
  cart,
  currency,
  changeCurrency,
  showCurrencyDropdown,
  isCurrActive,
  showMiniCart,
  getCartQuantity,
}) {
  const { loading, error, data } = useCategories();
  if (loading) return null;
  if (error) return `Error! ${error}`;
  const categories = data.categories;
  return (
    <div className="header">
      {categories.map((category) => {
        return (
          <NavLink
            className={({ isActive }) =>
              isActive ? "headerLink activeLink" : "headerLink"
            }
            to={category.name}
            key={category.name}
          >
            {category.name.toUpperCase()}
          </NavLink>
        );
      })}
      <img className="logo" src={shopLogo} alt="logo" />
      <Currency
        currency={currency}
        changeCurrency={changeCurrency}
        showCurrencyDropdown={showCurrencyDropdown}
        isCurrActive={isCurrActive}
      />
      <button className="headerCartButton" onClick={showMiniCart}>
        {cart.length > 0 && (
          <span className="headerCartQuantity">{getCartQuantity()}</span>
        )}
      </button>
    </div>
  );
}
