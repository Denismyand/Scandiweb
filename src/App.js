import { useState, useEffect } from "react";
import "./App.css";
import { MiniCart } from "./Cart.js";
import { useQuery, gql } from "@apollo/client";
import { Routes, Route, NavLink } from "react-router-dom";
import arrowDown from "./img/down-arrow.svg";
import arrowUp from "./img/up-arrow.svg";
import shopLogo from "./img/logo.svg";

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
  const [miniCartActive, setMiniCartActive] = useState(false);

  function isCartCached() {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart"));
    }
    return [];
  }

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
      return setCart(nextCart);
    }
    setCart([...cart, { ...product, cartQuantity: 1 }]);
  }

  function handleDecreaseCartQuantity(product) {
    if (product.cartQuantity > 1) {
      let decreased = cart.map((item) => {
        if (item.id === product.id) {
          return {
            ...item,
            cartQuantity: Number(item.cartQuantity) - 1,
          };
        }
        return item;
      });
      return setCart(decreased);
    }
    return setCart(cart.filter((item) => item.id !== product.id));
  }

  function showCurrencyDropdown() {
    setIsCurrActive(!isCurrActive);
  }

  function changeCurrency(curr, currSign) {
    setCurrency(curr);
    setCurrencySign(currSign);
  }

  function showMiniCart() {
    setMiniCartActive(!miniCartActive);
  }

  function handleSelectAttribute(product, attribute, id) {
    let changedProduct = cart.find((cartItem) => cartItem.id === product.id);
    let nextCart = cart.map((cartItem) => {
      if (cartItem.id !== changedProduct.id) {
        return cartItem;
      }
      let nextAttribute = cartItem.attributes.map((foundAttribute) => {
        if (foundAttribute.id !== attribute.id) {
          return foundAttribute;
        }
        let nextAttributeItem = foundAttribute.items.map(
          (foundAttributeItem) => {
            if (foundAttributeItem.id === id) {
              return { ...foundAttributeItem, selectedItem: true };
            }
            return {
              displayValue: foundAttributeItem.displayValue,
              value: foundAttributeItem.value,
              id: foundAttributeItem.id,
            };
          }
        );
        return { ...foundAttribute, items: nextAttributeItem };
      });
      return { ...cartItem, attributes: nextAttribute };
    });
    setCart(nextCart);
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
        showMiniCart={showMiniCart}
      />
      {miniCartActive ? (
        <MiniCart
          cart={cart}
          currency={currency}
          currencySign={currencySign}
          handleSelectAttribute={handleSelectAttribute}
          handleAddToCart={handleAddToCart}
          handleDecreaseCartQuantity={handleDecreaseCartQuantity}
        />
      ) : null}
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
  showMiniCart,
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
            alt=""
          />
        </button>
        {isCurrActive ? (
          <CurrencyList
            changeCurrency={changeCurrency}
            showCurrencyDropdown={showCurrencyDropdown}
          />
        ) : null}
      </div>
      <button className="headerCartButton" onClick={showMiniCart} />
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
    <div className="CategoryPage">
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
              <img
                className="productImg"
                src={product.gallery[0]}
                alt={product.name}
              />
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
                  return null;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
