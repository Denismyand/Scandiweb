import styles from "../styles/minicart.module.css";
import { Link } from "react-router-dom";

export function MiniCart({
  showMiniCart,
  cart,
  currency,
  getCartQuantity,
  handleSelectAttribute,
  handleProductIsInCart,
  handleDecreaseCartQuantity,
  getPercentOfCartTotal,
}) {
  return (
    <div className={styles.MiniCart}>
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
                  currency={currency}
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
  );
}

function MiniCartItem({
  cartItem,
  currency,
  handleSelectAttribute,
  handleProductIsInCart,
  handleDecreaseCartQuantity,
}) {
  return (
    <div className={styles.miniCartItem}>
      <div className={styles.miniCartItemInfo}>
        <MiniCartItemInfo cartItem={cartItem} currency={currency} />
        <ProductAttributes
          product={cartItem}
          handleSelectAttribute={handleSelectAttribute}
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

function MiniCartItemInfo({ cartItem, currency }) {
  return (
    <>
      <p className={styles.miniCartItemName}>{cartItem.brand}</p>
      <p className={styles.miniCartItemName}>{cartItem.name}</p>
      {cartItem.prices.map((price) => {
        if (price.currency.label === currency.label) {
          return (
            <p key={price.currency.label} className={styles.miniCartItemPrice}>
              {price.currency.symbol + price.amount}
            </p>
          );
        }
        return null;
      })}
    </>
  );
}

function ProductAttributes({ product, handleSelectAttribute }) {
  function differAttributes(attribute) {
    if (attribute.type === "text") {
      return (
        <>
          <p className={styles.attributeName}>{attribute.name}:</p>
          {attribute.items.map((item) => (
            <button
              className={
                item.selectedItem
                  ? styles.activeTextAttributeSelectButton
                  : styles.textAttributeSelectButton
              }
              key={item.id}
              onClick={() => handleSelectAttribute(product, attribute, item.id)}
            >
              {item.value}
            </button>
          ))}
        </>
      );
    }

    if (attribute.type === "swatch")
      return (
        <>
          <p className={styles.attributeName}>{attribute.name}:</p>
          {attribute.items.map((item) => {
            return (
              <button
                className={
                  item.selectedItem
                    ? styles.activeSwatchAttributeSelectButton
                    : styles.swatchAttributeSelectButton
                }
                key={item.id}
                style={{
                  backgroundColor: `${item.value}`,
                }}
                onClick={() =>
                  handleSelectAttribute(product, attribute, item.id)
                }
              />
            );
          })}
        </>
      );
  }
  return (
    <>
      {product.attributes.map((attribute) => {
        return <div key={attribute.id}>{differAttributes(attribute)}</div>;
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
