import styles from "./styles/productpage.module.css";
import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export function ProductPage({
  cart,
  setCart,
  product,
  currency,
  handleProductIsInCart,
}) {
  const [currImg, setCurrImg] = useState(0);
  const [attributes, setAttributes] = useState(getInitialAttributes());

  function getInitialAttributes() {
    let begin = [];
    for (let i = 0; i < product.attributes.length; i++) {
      begin.push({ index: 0 });
    }
    return begin;
  }

  function preDefineAttributes(attributeIndex, itemIndex) {
    let newAttributes = attributes.map((attribute, i) => {
      if (i !== attributeIndex) return attribute;
      return { index: itemIndex };
    });
    setAttributes(newAttributes);
  }

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
    foundInCart.attributes.map((attribute, i) => {
      attribute.items.map((item, itemIndex) => {
        if (itemIndex === attributes[i].index) {
          if (typeof item.selectedItem === "undefined") {
            similarity.current = false;
          }
          return null;
        }
        return null;
      });
      return null;
    });
    return similarity.current;
  }

  function handleProductIsNotInCart(product) {
    let newAttributes = product.attributes.map((attribute, i) => {
      let newItems = attribute.items.map((item, index) => {
        if (index === attributes[i].index) {
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
        cartItemId: uuidv4(),
        cartQuantity: 1,
      },
    ]);
  }

  function changeImage(imgIndex) {
    setCurrImg(imgIndex);
  }

  return (
    <div className={styles.ProductPage}>
      <div className={styles.productMiniPics}>
        {product.gallery.map((pic, index) => {
          return (
            <img
              className={
                currImg === index ? styles.activeImage : styles.inActiveImage
              }
              onClick={() => changeImage(index)}
              src={pic}
              alt=""
              key={pic}
            />
          );
        })}
      </div>
      <img
        className={styles.productPicture}
        src={product.gallery[currImg]}
        alt=""
      />
      <div className={styles.ProductInfo}>
        <ProductInfo
          product={product}
          currency={currency}
          attributes={attributes}
          preDefineAttributes={preDefineAttributes}
          handleAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}

function ProductInfo({
  product,
  currency,
  attributes,
  preDefineAttributes,
  handleAddToCart,
}) {
  return (
    <>
      <p className={styles.brand}>{product.brand}</p>
      <p className={styles.productName}>{product.name}</p>
      <ProductAttributes
        product={product}
        attributes={attributes}
        preDefineAttributes={preDefineAttributes}
      />
      {product.prices.map((price) => {
        if (price.currency.label === currency.label) {
          return (
            <div key={price.currency.label} className={styles.productPrice}>
              <p>PRICE:</p>
              <p className={styles.productPriceAmount}>
                {price.currency.symbol + price.amount}
              </p>
            </div>
          );
        }
        return null;
      })}
      {!product.inStock ? (
        <p className={styles.productIsOutOfStock}>Item is out of stock</p>
      ) : null}
      <button
        disabled={!product.inStock}
        className={
          product.inStock
            ? styles.addToCartButton
            : styles.addToCartButtonDisabled
        }
        onClick={() => handleAddToCart(product)}
      >
        ADD TO CART
      </button>
      <div
        className={styles.productDescription}
        dangerouslySetInnerHTML={{ __html: product.description }}
      />
    </>
  );
}

function ProductAttributes({ product, attributes, preDefineAttributes }) {
  function differAttributes(attribute, i) {
    if (attribute.type === "text") {
      return (
        <>
          <p className={styles.attributeName}>
            {attribute.name.toUpperCase()}:
          </p>
          {attribute.items.map((item, index) => (
            <button
              className={
                index === attributes[i].index
                  ? styles.activeTextAttributeSelectButton
                  : styles.textAttributeSelectButton
              }
              key={item.id}
              onClick={() => preDefineAttributes(i, index)}
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
          {attribute.items.map((item, index) => {
            return (
              <button
                className={
                  index === attributes[i].index
                    ? styles.activeSwatchAttributeSelectButton
                    : styles.swatchAttributeSelectButton
                }
                key={item.id}
                style={{
                  backgroundColor: `${item.value}`,
                }}
                onClick={() => preDefineAttributes(i, index)}
              />
            );
          })}
        </>
      );
  }
  return (
    <>
      {product.attributes.map((attribute, i) => {
        return <div key={attribute.id}>{differAttributes(attribute, i)}</div>;
      })}
    </>
  );
}
