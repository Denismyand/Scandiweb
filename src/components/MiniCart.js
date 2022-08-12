import styles from "../styles/minicart.module.css";
import { Link } from "react-router-dom";
import { ProductAttributes } from "./ProductAttributes.js";
import { useSelector, useDispatch } from "react-redux";
import {
  getCartQuantity,
  getPercentOfCartTotal,
} from "../utils/reusableFunctions";

export function MiniCart() {
  const cart = useSelector((state) => state.cart.items);

  const dispatch = useDispatch();

  function showMiniCart() {
    dispatch({ type: "showMiniCart", payload: "" });
  }

  return (
    <>
      <div className={styles.miniCartBackground} onClick={showMiniCart} />
      <div className={styles.miniCart}>
        {cart.length > 0 ? (
          <>
            <p className={styles.miniCartItemsQuantity}>
              <b>My Cart,</b> <span>{getCartQuantity(cart)} items</span>
            </p>
            <div>
              {cart.map((cartItem) => {
                return (
                  <MiniCartItem cartItem={cartItem} key={cartItem.cartItemId} />
                );
              })}
            </div>
            <MiniCartTotal cart={cart} />
          </>
        ) : (
          <div className={styles.cartEmptyMessage}>
            <h1>Your cart is empty</h1>
            <p>Add items to cart to start shopping</p>
          </div>
        )}
      </div>
    </>
  );
}

function MiniCartItem({ cartItem }) {
  const dispatch = useDispatch();

  function handleProductIsInCart(foundInCart) {
    dispatch({ type: "productIsInCart", payload: foundInCart });
  }

  function handleDecreaseCartQuantity(product) {
    dispatch({ type: "decreaseCartQuantity", payload: product });
  }

  return (
    <div className={styles.miniCartItem}>
      <div className={styles.miniCartItemInfo}>
        <MiniCartItemInfo cartItem={cartItem} />
        <ProductAttributes product={cartItem} styles={styles} />
      </div>
      <div className={styles.miniCartItemQuantity}>
        <button
          className={styles.miniCartIncreaseQtyButton}
          onClick={() => handleProductIsInCart(cartItem)}
        />
        <p className={styles.miniCartQtyNumber}>{cartItem.cartQuantity}</p>
        <button
          className={styles.miniCartDecreaseQtyButton}
          onClick={() => handleDecreaseCartQuantity(cartItem)}
        />
      </div>
      <img
        className={styles.miniCartItemPicture}
        src={cartItem.gallery[0]}
        alt={cartItem.name}
      />
    </div>
  );
}

function MiniCartItemInfo({ cartItem }) {
  const currency = useSelector((state) => state.currency);

  return (
    <>
      <p className={styles.miniCartItemName}>{cartItem.brand}</p>
      <p className={styles.miniCartItemName}>{cartItem.name}</p>
      {cartItem.prices.map((price) => {
        return (
          price.currency.label === currency.label && (
            <p key={price.currency.label} className={styles.miniCartItemPrice}>
              {price.currency.symbol + price.amount}
            </p>
          )
        );
      })}
    </>
  );
}

function MiniCartTotal({ cart, showMiniCart }) {
  const currency = useSelector((state) => state.currency);

  return (
    <div className={styles.miniCartTotal}>
      <div className={styles.miniCartTotalLeft}>
        <b>Total</b>
        <Link
          className={styles.toCartMiniCartButton}
          to="/cart"
          onClick={showMiniCart}
        >
          VIEW CART
        </Link>
      </div>
      <div className={styles.miniCartTotalRight}>
        <b>{getPercentOfCartTotal(100, cart, currency)}</b>
        <Link
          className={styles.toCheckoutMiniCartButton}
          to="/cart"
          onClick={showMiniCart}
        >
          CHECK OUT
        </Link>
      </div>
    </div>
  );
}
