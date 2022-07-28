import { useState, useEffect, useRef } from "react";
import "./styles/App.css";
import { CategoryPage } from "./CategoryPage.js";
import { ProductPage } from "./ProductPage.js";
import { MainOverlay } from "./components/MainOverlay.js";
import { Cart } from "./Cart.js";
import { getProducts } from "./utils/request.js";
import { useQuery } from "@apollo/client";
import { Routes, Route } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

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
    return cart.reduce((total, current) => total + current.cartQuantity, 0);
  }

  function getPercentOfCartTotal(percent) {
    let total = 0;

    cart.forEach((cartItem) => {
      let itemPrice;

      cartItem.prices.forEach((price) => {
        if (price.currency.label === currency.label) {
          itemPrice = price.amount;
        }
      });

      return (total += cartItem.cartQuantity * itemPrice);
    });
    return currency.sign + Math.round(total * (percent / 100) * 100) / 100;
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
    setCart([
      ...cart,
      {
        ...product,
        attributes: newAttributes,
        cartItemId: uuidv4(),
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
      setCart(decreased);
      return;
    }
    setCart(
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
            getPercentOfCartTotal={getPercentOfCartTotal}
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
              categories={data.categories}
              currency={currency}
              handleAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path={":categoryName"}
          element={
            <CategoryPage
              categories={data.categories}
              currency={currency}
              handleAddToCart={handleAddToCart}
            />
          }
        />

        <Route
          path={":categoryName/:productId"}
          element={
            <ProductPage
              categories={data.categories}
              cart={cart}
              setCart={setCart}
              currency={currency}
              handleProductIsInCart={handleProductIsInCart}
            />
          }
        />

        <Route
          path="cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
              currency={currency}
              getPercentOfCartTotal={getPercentOfCartTotal}
              getCartQuantity={getCartQuantity}
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
