import { Currency } from "./Currency.js";
import { MiniCart } from "./MiniCart.js";
import { Outlet, NavLink } from "react-router-dom";
import shopLogo from "../img/logo.svg";
import { useCategories } from "../utils/request.js";
import { getCartQuantity } from "../utils/reusableFunctions.js";
import { useDispatch, useSelector } from "react-redux";

export function MainOverlay() {
  const miniCartActive = useSelector((state) => state.cart.isActive);

  return (
    <>
      <Header />
      {miniCartActive && <MiniCart />}
      <Outlet />
    </>
  );
}

function Header() {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  function showMiniCart() {
    dispatch({ type: "showMiniCart", payload: "" });
  }
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
      <Currency />
      <button className="headerCartButton" onClick={showMiniCart}>
        {cart.length > 0 && (
          <span className="headerCartQuantity">{getCartQuantity(cart)}</span>
        )}
      </button>
    </div>
  );
}
