import React from "react";
import { Currency } from "./Currency";
import { MiniCart } from "./MiniCart";
import { Outlet, NavLink } from "react-router-dom";
import shopLogo from "../img/logo.svg";
import { useCategories } from "../utils/request";
import { getCartQuantity } from "../utils/reusableFunctions";
import { useDispatch, useSelector } from "react-redux";
import { CartReducer, CategoryInfo } from "../utils/types";
import { showMiniCart } from "../utils/reducers/cartSlice";

export function MainOverlay() {
  const miniCartActive = useSelector(
    (state: CartReducer) => state.cart.isActive
  );

  return (
    <>
      <Header />
      {miniCartActive && <MiniCart />}
      <Outlet />
    </>
  );
}

function Header() {
  const cart = useSelector((state: CartReducer) => state.cart.items);
  const dispatch = useDispatch();

  const { loading, error, data } = useCategories();
  if (loading) return null;
  if (error) return <>`Error! {error}`</>;
  const categories = data.categories;
  return (
    <div className="header">
      {categories.map((category: CategoryInfo) => {
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
      <button
        className="headerCartButton"
        onClick={() => dispatch(showMiniCart())}
      >
        {cart.length > 0 && (
          <span className="headerCartQuantity">{getCartQuantity(cart)}</span>
        )}
      </button>
    </div>
  );
}
