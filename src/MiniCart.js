import styles from "./minicart.module.css";
import { Link } from "react-router-dom";

export function MiniCart({
  showMiniCart,
  cart,
  currency,
  getCartQuantity,
  handleSelectAttribute,
  handleAddToCart,
  handleDecreaseCartQuantity,
  getCartTotal,
}) {
  return (
    <div className={styles.MiniCart}>
      {cart.length > 0 ? (
        <>
          <b>My cart.</b> <span>{getCartQuantity()} items</span>
          <div>
            {cart.map((cartItem) => {
              return (
                <div className={styles.miniCartItem} key={cartItem.id}>
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
                      onClick={() => handleAddToCart(cartItem)}
                    />
                    <p className={styles.miniCartQtyNumber}>
                      {cartItem.cartQuantity}
                    </p>
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
            })}
          </div>
          <MiniCartTotal
            showMiniCart={showMiniCart}
            getCartTotal={getCartTotal}
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

function MiniCartItemInfo({ cartItem, currency }) {
  return (
    <>
      <p>{cartItem.brand}</p>
      <p>{cartItem.name}</p>
      {cartItem.prices.map((price) => {
        if (price.currency.label === currency) {
          return (
            <p key={price.currency.label}>
              <b>{price.currency.symbol + price.amount}</b>
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
          <p>{attribute.name}:</p>
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
              <b> {item.value}</b>
            </button>
          ))}
        </>
      );
    }

    if (attribute.type === "swatch")
      return (
        <>
          <p>{attribute.name}:</p>
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

function MiniCartTotal({ showMiniCart, getCartTotal }) {
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
        <b>{getCartTotal()}</b>
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
