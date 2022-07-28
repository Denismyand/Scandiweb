import { useState, useEffect, useRef } from "react";
import "./styles/App.css";
import { Currency } from "./components/Currency.js";
import { CategoryPage } from "./components/CategoryPage.js";
import { ProductPage } from "./ProductPage.js";
import { MiniCart } from "./MiniCart.js";
import { Cart } from "./Cart.js";
import { getProducts } from "./utils/request.js";
import { useQuery } from "@apollo/client";
import { Outlet, Routes, Route, NavLink } from "react-router-dom";
import shopLogo from "./img/logo.svg";

export default function App() {
  const { loading, error, data } = useQuery(getProducts);
  const [currency, setCurrency] = useState({
    label: "USD",
    sign: "$",
  });
  const [cart, setCart] = useState(isCartCached());

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
        if (price.currency.label === currency.label) {
          itemPrice = price.amount;
        }
        return null;
      });

      return (total += cartItem.cartQuantity * itemPrice);
    });
    return currency.sign + Math.round(total * 100) / 100;
  }

  function getCartTax(tax) {
    let total = 0;

    cart.map((cartItem) => {
      let itemPrice;

      cartItem.prices.map((price) => {
        if (price.currency.label === currency.label) {
          itemPrice = price.amount;
        }
        return null;
      });

      return (total += cartItem.cartQuantity * itemPrice);
    });
    return currency.sign + Math.round(total * (tax / 100) * 100) / 100;
  }

  const maxCartQuantity = 5;

  function handleAddToCart(product) {
    if (cart.length > 0) {
      let foundInCart = cart.find(
        (cartItem) => cartItem.id === product.id && isSame(cartItem)
      );
      if (foundInCart) {
        if (isSame(foundInCart)) return handleProductIsInCart(foundInCart);
      }
    }
    return handleProductIsNotInCart(product);
  }

  const similarity = useRef(true);

  function isSame(foundInCart) {
    similarity.current = true;
    foundInCart.attributes.forEach((attribute) => {
      attribute.items.forEach((item, itemIndex) => {
        if (itemIndex === 0) {
          if (!item.selectedItem) {
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
    setCart(nextCart);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.length]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <MainOverlay
            cart={cart}
            categories={data.categories}
            currency={currency}
            setCurrency={setCurrency}
            getCartQuantity={getCartQuantity}
            getCartTotal={getCartTotal}
            handleSelectAttribute={handleSelectAttribute}
            handleProductIsInCart={handleProductIsInCart}
            handleDecreaseCartQuantity={handleDecreaseCartQuantity}
          />
        }
      >
        <Route
          index
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
              path={category.name}
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
        {data.categories.map((category) => {
          return category.products.map((product) => {
            return (
              <Route
                path={category.name + "/:" + product.id}
                key={product.id}
                element={
                  <ProductPage
                    cart={cart}
                    setCart={setCart}
                    product={product}
                    currency={currency}
                    handleProductIsInCart={handleProductIsInCart}
                  />
                }
              />
            );
          });
        })}
        <Route
          path="cart"
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
      </Route>
    </Routes>
  );
}

function MainOverlay({
  cart,
  categories,
  currency,
  setCurrency,
  getCartQuantity,
  getCartTotal,
  handleSelectAttribute,
  handleProductIsInCart,
  handleDecreaseCartQuantity,
}) {
  const [isCurrActive, setIsCurrActive] = useState(false);
  const [miniCartActive, setMiniCartActive] = useState(false);

  function showCurrencyDropdown() {
    setIsCurrActive(!isCurrActive);
  }

  function changeCurrency(curr, currSign) {
    setCurrency({ label: curr, sign: currSign });
  }

  function showMiniCart() {
    setMiniCartActive(!miniCartActive);
  }
  return (
    <>
      <div onClick={() => (isCurrActive ? setIsCurrActive(false) : null)}>
        <Header
          cart={cart}
          categories={categories}
          currency={currency}
          changeCurrency={changeCurrency}
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
      </div>
      <Outlet />
    </>
  );
}

function Header({
  cart,
  categories,
  currency,
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
        currency={currency}
        changeCurrency={changeCurrency}
        showCurrencyDropdown={showCurrencyDropdown}
        isCurrActive={isCurrActive}
      />
      <button className="headerCartButton" onClick={showMiniCart}>
        {cart.length > 0 ? (
          <span className="headerCartQuantity">{getCartQuantity()}</span>
        ) : null}
      </button>
    </div>
  );
}
