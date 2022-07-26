import styles from "./productpage.module.css";
import { useState, useRef, useEffect } from "react";

export function ProductPage({ product, currency, handleSelectAttribute }) {
  const [currImg, setCurrImg] = useState(0);

  const imgToScrollTo = useRef(null);

  function changeImage(imgIndex) {
    setCurrImg(imgIndex);
  }

  function prevImg() {
    if (currImg > 0) setCurrImg(currImg - 1);
  }

  function nextImg() {
    if (currImg < product.gallery.length - 1) setCurrImg(currImg + 1);
  }

  useEffect(() => {
    imgToScrollTo.current.scrollIntoView({ block: "center" });
  }, [currImg]);

  return (
    <div className={styles.ProductPage}>
      <div className={styles.productMiniPicsContainer}>
        {product.gallery.length < 5 ? null : (
          <button
            className={styles.prevPic}
            onClick={prevImg}
            disabled={currImg < 1}
          />
        )}
        <div className={styles.productMiniPics}>
          {product.gallery.map((pic, index) => {
            return (
              <img
                className={
                  currImg === index ? styles.activeImage : styles.inActiveImage
                }
                onClick={() => changeImage(index)}
                src={pic}
                ref={currImg === index ? imgToScrollTo : null}
                alt=""
                key={pic}
              />
            );
          })}
        </div>
        {product.gallery.length < 5 ? null : (
          <button
            className={styles.nextPic}
            onClick={nextImg}
            disabled={currImg >= product.gallery.length - 1}
          />
        )}
      </div>
      <img
        className={styles.productPicture}
        src={product.gallery[currImg]}
        alt=""
      />
      <div className={styles.productInfo}>
        <ProductInfo
          product={product}
          currency={currency}
          handleSelectAttribute={handleSelectAttribute}
        />
      </div>
    </div>
  );
}

function ProductInfo({ product, currency, handleSelectAttribute }) {
  return (
    <>
      <p className={styles.brand}>{product.brand}</p>
      <p className={styles.productName}>{product.name}</p>
      <ProductAttributes
        product={product}
        handleSelectAttribute={handleSelectAttribute}
      />
      {product.prices.map((price) => {
        if (price.currency.label === currency) {
          return (
            <p key={price.currency.label} className={styles.productPrice}>
              {price.currency.symbol + price.amount}
            </p>
          );
        }
        return null;
      })}
      <button disabled={!product.inStock}>Add to cart</button>
      <div dangerouslySetInnerHTML={{ __html: product.description }} />
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
