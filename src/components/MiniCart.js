import styles from "../styles/minicart.module.css";
import { Link } from "react-router-dom";
import { ProductAttributes } from "./ProductAttributes.js";
import { useSelector } from "react-redux";


export function MiniCart({
  showMiniCart,
  cart,
  getCartQuantity,
  handleSelectAttribute,
  handleProductIsInCart,
  handleDecreaseCartQuantity,
  getPercentOfCartTotal,
}) {
  return (
    <>
      <div className={styles.miniCartBackground} onClick={showMiniCart} />
      <div className={styles.miniCart}>
        {cart.length > 0 ? (
          <>
            <p className={styles.miniCartItemsQuantity}>
              <b>My Cart,</b> <span>{getCartQuantity()} items</span>
            </p>
            <div>
              {cart.map((cartItem) => {
                return (
                  <MiniCartItem
                    cartItem={cartItem}
                    handleSelectAttribute={handleSelectAttribute}
                    handleProductIsInCart={handleProductIsInCart}
                    handleDecreaseCartQuantity={handleDecreaseCartQuantity}
                    key={cartItem.cartItemId}
                  />
                );
              })}
            </div>
            <MiniCartTotal
              showMiniCart={showMiniCart}
              getPercentOfCartTotal={getPercentOfCartTotal}
            />
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

function MiniCartItem({
  cartItem,
  handleSelectAttribute,
  handleProductIsInCart,
  handleDecreaseCartQuantity,
}) {
  return (
    <div className={styles.miniCartItem}>
      <div className={styles.miniCartItemInfo}>
        <MiniCartItemInfo cartItem={cartItem} />
        <ProductAttributes
          product={cartItem}
          handleSelectAttribute={handleSelectAttribute}
          styles={styles}
        />
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

function MiniCartTotal({ showMiniCart, getPercentOfCartTotal }) {
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
        <b>{getPercentOfCartTotal(100)}</b>
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
