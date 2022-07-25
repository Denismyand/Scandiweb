import styles from "./cart.module.css";
import { useState } from "react";

export function Cart({
  cart,
  setCart,
  currency,
  getCartTax,
  getCartQuantity,
  getCartTotal,
  handleSelectAttribute,
  handleAddToCart,
  handleDecreaseCartQuantity,
}) {
  return (
    <div className={styles.CartPage}>
      <h1>CART</h1>
      {cart.length > 0 ? (
        <>
          <div>
            {cart.map((cartItem) => {
              return (
                <div key={cartItem.id}>
                  <hr />
                  <div className={styles.cartItem}>
                    <div className={styles.cartItemInfo}>
                      <MiniCartItemInfo
                        cartItem={cartItem}
                        currency={currency}
                      />
                      <ProductAttributes
                        product={cartItem}
                        handleSelectAttribute={handleSelectAttribute}
                      />
                    </div>
                    <div className={styles.cartItemQuantity}>
                      <button
                        className={styles.cartIncreaseQtyButton}
                        onClick={() => handleAddToCart(cartItem)}
                      />
                      <p className={styles.cartQtyNumber}>
                        {cartItem.cartQuantity}
                      </p>
                      <button
                        className={styles.cartDecreaseQtyButton}
                        onClick={() => handleDecreaseCartQuantity(cartItem)}
                      />
                    </div>
                    <CartItemPicture cartItem={cartItem} />
                  </div>
                </div>
              );
            })}
          </div>
          <CartTotal
            setCart={setCart}
            getCartTax={getCartTax}
            getCartTotal={getCartTotal}
            getCartQuantity={getCartQuantity}
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
      <p className={styles.brand}>{cartItem.brand}</p>
      <p className={styles.productName}>{cartItem.name}</p>
      {cartItem.prices.map((price) => {
        if (price.currency.label === currency) {
          return (
            <p key={price.currency.label} className={styles.productPrice}>
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
          <p className={styles.attributeName}>
            {attribute.name.toUpperCase()}:
          </p>
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
          <p className={styles.attributeName}>
            {attribute.name.toUpperCase()}:
          </p>
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

function CartItemPicture({ cartItem }) {
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

function CartTotal({ setCart, getCartTax, getCartTotal, getCartQuantity }) {
  return (
    <>
      <hr />
      <div className={styles.cartTotal}>
        <div>
          <p>Tax 21%:</p>
          <p>Quantity:</p>
          <p className={styles.cartTotalText}>Total:</p>
        </div>
        <div>
          <p>
            <b>{getCartTax(21)}</b>
          </p>
          <p>
            <b>{getCartQuantity()}</b>
          </p>
          <p>
            <b>{getCartTotal()}</b>
          </p>
        </div>
      </div>
      <button className={styles.orderButton} onClick={() => setCart([])}>
        ORDER
      </button>
    </>
  );
}
