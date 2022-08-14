import React from "react";
import styles from "./styles/cart.module.css";
import { useState } from "react";
import { ProductAttributes } from "./components/ProductAttributes";
import { useSelector, useDispatch } from "react-redux";
import {
  getCartQuantity,
  getPercentOfCartTotal,
} from "./utils/reusableFunctions";
import { CartContent, PricesInfo } from "./utils/types";

export function Cart({ cart }: { cart: CartContent[] }) {
  return (
    <div className={styles.cartPage}>
      <h1>CART</h1>
      {cart.length > 0 ? (
        <>
          <div>
            {cart.map((cartItem) => {
              return <CartItem cartItem={cartItem} key={cartItem.cartItemId} />;
            })}
          </div>
          <CartTotal cart={cart} />
        </>
      ) : (
        <div className={styles.cartEmptyMessage}>
          <h1>Your cart is empty</h1>
          <p>Add items to cart to start shopping</p>
        </div>
      )}
    </div>
  );
}

function CartItem({ cartItem }: { cartItem: CartContent }) {
  const dispatch = useDispatch();

  function handleProductIsInCart(foundInCart: CartContent) {
    dispatch({ type: "productIsInCart", payload: foundInCart });
  }

  function handleDecreaseCartQuantity(product: CartContent) {
    dispatch({ type: "decreaseCartQuantity", payload: product });
  }

  return (
    <div>
      <hr />
      <div className={styles.cartItem}>
        <div className={styles.cartItemInfo}>
          <CartItemInfo cartItem={cartItem} />
          <ProductAttributes product={cartItem} styles={styles} />
        </div>
        <div className={styles.cartItemQuantity}>
          <button
            className={styles.cartIncreaseQtyButton}
            onClick={() => handleProductIsInCart(cartItem)}
          />
          <p className={styles.cartQtyNumber}>{cartItem.cartQuantity}</p>
          <button
            className={styles.cartDecreaseQtyButton}
            onClick={() => handleDecreaseCartQuantity(cartItem)}
          />
        </div>
        <CartItemPicture cartItem={cartItem} />
      </div>
    </div>
  );
}

function CartItemInfo({ cartItem }: { cartItem: CartContent }) {
  const currency = useSelector((state: PricesInfo) => state.currency);

  return (
    <>
      <p className={styles.brand}>{cartItem.brand}</p>
      <p className={styles.productName}>{cartItem.name}</p>
      {cartItem.prices.map((price) => {
        return (
          price.currency.label === currency.label && (
            <p key={price.currency.label} className={styles.productPrice}>
              {price.currency.symbol + price.amount}
            </p>
          )
        );
      })}
    </>
  );
}

function CartItemPicture({ cartItem }: { cartItem: CartContent }) {
  const [currentImg, setCurrentImg] = useState(0);

  function nextImg() {
    setCurrentImg(currentImg + 1);
    if (currentImg === cartItem.gallery.length - 1) {
      setCurrentImg(0);
    }
  }

  function prevImg() {
    setCurrentImg(currentImg - 1);
    if (currentImg === 0) {
      setCurrentImg(cartItem.gallery.length - 1);
    }
  }

  return (
    <div>
      <img
        className={styles.cartItemPicture}
        src={cartItem.gallery[currentImg]}
        alt={cartItem.name}
      />
      <button
        className={styles.prevPicButton}
        onClick={prevImg}
        hidden={cartItem.gallery.length === 1}
      />
      <button
        className={styles.nextPicButton}
        onClick={nextImg}
        hidden={cartItem.gallery.length === 1}
      />
    </div>
  );
}

function CartTotal({ cart }: { cart: CartContent[] }) {
  const currency = useSelector((state: PricesInfo) => state.currency);

  const dispatch = useDispatch();

  function emptyCart() {
    dispatch({ type: "setToEmpty", payload: "" });
  }

  const tax = 21;
  return (
    <>
      <hr />
      <div className={styles.cartTotal}>
        <div>
          <p>Tax {tax}%:</p>
          <p>Quantity:</p>
          <p className={styles.cartTotalText}>Total:</p>
        </div>
        <div>
          <p>
            <b>{getPercentOfCartTotal(tax, cart, currency)}</b>
          </p>
          <p>
            <b>{getCartQuantity(cart)}</b>
          </p>
          <p>
            <b>{getPercentOfCartTotal(100, cart, currency)}</b>
          </p>
        </div>
      </div>
      <button className={styles.orderButton} onClick={() => emptyCart()}>
        ORDER
      </button>
    </>
  );
}
