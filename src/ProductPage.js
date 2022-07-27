import styles from "./productpage.module.css";
import { useState } from "react";

export function ProductPage({ product, currency }) {
  const [currImg, setCurrImg] = useState(0);
  const [attributes, setAttributes] = useState(getInitialAttributes());

  function getInitialAttributes() {
    let begin = [];
    for (let i = 0; i < product.attributes.length; i++) {
      begin.push({ index: 0 });
    }
    return begin;
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
          setAttributes={setAttributes}
        />
      </div>
    </div>
  );
}

function ProductInfo({ product, currency, attributes, setAttributes }) {
  return (
    <>
      <p className={styles.brand}>{product.brand}</p>
      <p className={styles.productName}>{product.name}</p>
      <ProductAttributes
        product={product}
        attributes={attributes}
        setAttributes={setAttributes}
      />
      {product.prices.map((price) => {
        if (price.currency.label === currency) {
          return (
            <div key={price.currency.label} className={styles.productPrice}>
              <p>PRICE:</p>
              <p>{price.currency.symbol + price.amount}</p>
            </div>
          );
        }
        return null;
      })}
      <button disabled={!product.inStock} className={styles.addToCartButton}>
        Add to cart
      </button>
      <div
        className={styles.productDescription}
        dangerouslySetInnerHTML={{ __html: product.description }}
      />
    </>
  );
}

function ProductAttributes({ product, attributes, setAttributes }) {
  function preDefineAttributes(attributeIndex, itemIndex) {
    let newAttributes = attributes.map((attribute, i) => {
      if (i !== attributeIndex) return attribute;
      return { index: itemIndex };
    });
    setAttributes(newAttributes);
  }

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
