import { useState, useEffect, useRef } from "react";
import "./App.css";
import { Currency } from "./Currency.js";
import { MiniCart } from "./MiniCart.js";
import { Cart } from "./Cart.js";
import { useQuery, gql } from "@apollo/client";
import { Routes, Route, NavLink } from "react-router-dom";

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

  function getCartQuantity() {
    let total = 0;

    cart.map((cartItem) => (total += cartItem.cartQuantity));
    return total;
  }

  function getCartTotal() {
    let total = 0;

    cart.map((cartItem) => {
      let itemPrice;

      cartItem.prices.map((price) => {
        if (price.currency.label === currency) {
          itemPrice = price.amount;
        }
        return null;
      });

      return (total += cartItem.cartQuantity * itemPrice);
    });
    return currencySign + Math.round(total * 100) / 100;
  }

  function getCartTax(tax) {
    let total = 0;

    cart.map((cartItem) => {
      let itemPrice;

      cartItem.prices.map((price) => {
        if (price.currency.label === currency) {
          itemPrice = price.amount;
        }
        return null;
      });

      return (total += cartItem.cartQuantity * itemPrice);
    });
    return currencySign + Math.round(total * (tax / 100) * 100) / 100;
  }

  const maxCartQuantity = 5;

  function handleAddToCart(product) {
    if (cart.length > 0) {
      let foundInCart = cart.find(
        (cartItem) => cartItem.id === product.id && isSame(cartItem)
      );
      if (foundInCart) {
        if (isSame(foundInCart)) return handleProductIsInCart(foundInCart);
        return handleProductIsNotInCart(product);
      }
      return handleProductIsNotInCart(product);
    }
    return handleCartIsEmpty(product);
  }

  const similarity = useRef(true);

  function isSame(foundInCart) {
    similarity.current = true;
    foundInCart.attributes.map((attribute) => {
      attribute.items.map((item, itemIndex) => {
        if (itemIndex === 0) {
          if (typeof item.selectedItem === "undefined") {
            similarity.current = false;
          }
        }
      });
    });
    return similarity.current;
  }

  function handleProductIsInCart(foundInCart) {
    let nextCart = cart.map((cartItem) => {
      if (cartItem.cartItemId === foundInCart.cartItemId) {
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

  function handleProductIsNotInCart(product) {
    let newAttributes = product.attributes.map((attribute) => {
      let newItems = attribute.items.map((item, i) => {
        if (i === 0) {
          return { ...item, selectedItem: true };
        }
        return item;
      });
      return { ...attribute, items: newItems };
    });
    return setCart([
      ...cart,
      {
        ...product,
        attributes: newAttributes,
        cartItemId: 999,
        cartQuantity: 1,
      },
    ]);
  }

  function handleCartIsEmpty(product) {
    let newAttributes = product.attributes.map((attribute) => {
      let newItems = attribute.items.map((item, i) => {
        if (i === 0) {
          return { ...item, selectedItem: true };
        }
        return item;
      });
      return { ...attribute, items: newItems };
    });
    return setCart([
      {
        ...product,
        attributes: newAttributes,
        cartItemId: 999,
        cartQuantity: 1,
      },
    ]);
  }

  function handleDecreaseCartQuantity(product) {
    if (product.cartQuantity > 1) {
      let decreased = cart.map((cartItem) => {
        if (cartItem.cartItemId === product.cartItemId) {
          return {
            ...cartItem,
            cartQuantity: Number(cartItem.cartQuantity) - 1,
          };
        }
        return cartItem;
      });
      return setCart(decreased);
    }
    return setCart(
      cart.filter((cartItem) => cartItem.cartItemId !== product.cartItemId)
    );
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
    let changedProduct = cart.find(
      (cartItem) => cartItem.cartItemId === product.cartItemId
    );
    let nextCart = cart.map((cartItem) => {
      if (cartItem.cartItemId !== changedProduct.cartItemId) {
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

  function setCartItemIds() {
    let nextCart = cart.map((cartItem, i) => {
      return { ...cartItem, cartItemId: i };
    });
    setCart(nextCart);
  }

  useEffect(() => {
    setCartItemIds();
  }, [cart.length]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
  return (
    <div onClick={() => (isCurrActive ? setIsCurrActive(false) : null)}>
      <Header
        categories={data.categories}
        changeCurrency={changeCurrency}
        currencySign={currencySign}
        showCurrencyDropdown={showCurrencyDropdown}
        isCurrActive={isCurrActive}
        showMiniCart={showMiniCart}
        getCartQuantity={getCartQuantity}
      />
      {miniCartActive ? (
        <MiniCart
          showMiniCart={showMiniCart}
          cart={cart}
          currency={currency}
          getCartQuantity={getCartQuantity}
          getCartTotal={getCartTotal}
          handleSelectAttribute={handleSelectAttribute}
          handleProductIsInCart={handleProductIsInCart}
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
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
              currency={currency}
              getCartTax={getCartTax}
              getCartQuantity={getCartQuantity}
              getCartTotal={getCartTotal}
              handleSelectAttribute={handleSelectAttribute}
              handleProductIsInCart={handleProductIsInCart}
              handleDecreaseCartQuantity={handleDecreaseCartQuantity}
            />
          }
        />
      </Routes>
    </div>
  );
}

function Header({
  categories,
  currencySign,
  changeCurrency,
  showCurrencyDropdown,
  isCurrActive,
  showMiniCart,
  getCartQuantity,
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
      <Currency
        currencySign={currencySign}
        changeCurrency={changeCurrency}
        showCurrencyDropdown={showCurrencyDropdown}
        isCurrActive={isCurrActive}
      />
      <button className="headerCartButton" onClick={showMiniCart}>
        <span className="headerCartQuantity">{getCartQuantity()}</span>
      </button>
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
