import { useEffect } from "react";
import "./styles/App.css";
import { CategoryPage } from "./CategoryPage.js";
import { ProductPageWrapper } from "./ProductPage.js";
import { MainOverlay } from "./components/MainOverlay";
import { Cart } from "./Cart.js";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function App() {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart.items);

  const currencyIsActive = useSelector((state) => state.currency.isActive);

  function showCurrencyDropdown() {
    dispatch({ type: "currencyDropdown", payload: "" });
  }

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <div onClick={() => currencyIsActive && showCurrencyDropdown()}>
      <Routes>
        <Route
          path="/*"
          element={
            <>
              <MainOverlay />
            </>
          }
        >
          <Route index element={<Navigate to="/all" />} />
          <Route path={":categoryName"} element={<CategoryPage />} />

          <Route
            path={":categoryName/:productId"}
            element={<ProductPageWrapper />}
          />

          <Route path="cart" element={<Cart cart={cart} />} />
        </Route>
      </Routes>
    </div>
  );
}
