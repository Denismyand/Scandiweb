import { useState, useEffect } from "react";
import "./App.css";
import { useQuery, gql } from "@apollo/client";
import { Routes, Route, NavLink, Link } from "react-router-dom";
import arrowDown from "./down-arrow.svg";
import arrowUp from "./up-arrow.svg";
import shopLogo from "./logo.svg";

const Get_Categories = gql`
  query GetProducts {
    categories {
      name
      products {
        id
        name
        inStock
        gallery
        description
        category
        attributes {
          id
          name
          type
          items {
            displayValue
            value
            id
          }
        }
        prices {
          currency {
            label
            symbol
          }
          amount
        }
        brand
      }
    }
  }
`;

export default function App() {
  const { loading, error, data } = useQuery(Get_Categories);
  const [currency, setCurrency] = useState("USD");
  const [currencySign, setCurrencySign] = useState("$");
  const [isCurrActive, setIsCurrActive] = useState(false);
  const [cart, setCart] = useState(isCartCached());

  const maxCartQuantity = 5;

  function handleAddToCart(product) {
    let foundInCart = cart.find((cartItem) => cartItem.id === product.id);
    if (foundInCart) {
      let nextCart = cart.map((cartItem) => {
        if (cartItem.id === foundInCart.id) {
          if (foundInCart.cartQuantity >= maxCartQuantity) {
            return { ...foundInCart, cartQuantity: Number(maxCartQuantity) };
          }
          return {
            ...foundInCart,
            cartQuantity: Number(foundInCart.cartQuantity + 1),
          };
        }
        return cartItem;
      });
      setCart(nextCart);
    }
    setCart([...cart, { ...product, cartQuantity: 1 }]);
  }

  function isCartCached() {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart"));
    }
    return [];
  }

  function showCurrencyDropdown() {
    setIsCurrActive(!isCurrActive);
  }

  function changeCurrency(curr, currSign) {
    setCurrency(curr);
    setCurrencySign(currSign);
  }

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
  return (
    <>
      <Header
        categories={data.categories}
        changeCurrency={changeCurrency}
        currencySign={currencySign}
        showCurrencyDropdown={showCurrencyDropdown}
        isCurrActive={isCurrActive}
      />
      <Routes>
        <Route
          path="/*"
          element={
            <CategoryPage
              category={data.categories[0]}
              currency={currency}
              handleAddToCart={handleAddToCart}
            />
          }
        />
        {data.categories.map((category) => {
          return (
            <Route
              path={"/" + category.name}
              key={category.name}
              element={
                <CategoryPage
                  category={category}
                  currency={currency}
                  handleAddToCart={handleAddToCart}
                />
              }
            />
          );
        })}
      </Routes>
    </>
  );
}

function Header({
  categories,
  currencySign,
  changeCurrency,
  showCurrencyDropdown,
  isCurrActive,
}) {
  return (
    <div className="Header">
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
          />
        </button>
        {isCurrActive ? (
          <CurrencyList
            changeCurrency={changeCurrency}
            showCurrencyDropdown={showCurrencyDropdown}
          />
        ) : null}
      </div>
      <button className="headerCartButton" />
    </div>
  );
}

function CurrencyList({ changeCurrency, showCurrencyDropdown }) {
  return (
    <div className="currencyList">
      <p
        onClick={() => {
          changeCurrency("USD", "$");
          showCurrencyDropdown();
        }}
      >
        $ USD
      </p>
      <p
        onClick={() => {
          changeCurrency("GBP", "£");
          showCurrencyDropdown();
        }}
      >
        £ GBP
      </p>
      <p
        onClick={() => {
          changeCurrency("AUD", "A$");
          showCurrencyDropdown();
        }}
      >
        A$ AUD
      </p>
      <p
        onClick={() => {
          changeCurrency("JPY", "¥");
          showCurrencyDropdown();
        }}
      >
        ¥ JPY
      </p>
    </div>
  );
}

function CategoryPage({ category, currency, handleAddToCart }) {
  return (
    <div className="categoryPage">
      <h1> Category: {category.name}</h1>
      <div className="productList">
        {category.products.map((product) => {
          return (
            <div
              className={product.inStock ? "product" : "outOfStockProduct"}
              key={product.id}
            >
              {product.inStock ? null : (
                <p className="outOfStockMessage">OUT OF STOCK</p>
              )}
              <img className="productImg" src={product.gallery[0]} />
              <button
                className="addToCartButton"
                onClick={() => handleAddToCart(product)}
              />
              <div className="productInfo">
                <p>{product.name}</p>
                {product.prices.map((price) => {
                  if (price.currency.label === currency) {
                    return (
                      <p key={price.currency.label}>
                        <b>{price.currency.symbol + price.amount}</b>
                      </p>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
