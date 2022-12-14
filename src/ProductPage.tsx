import React from "react";
import styles from "./styles/productpage.module.css";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { sanitize } from "dompurify";
import { useProduct } from "./utils/request";
import { useDispatch, useSelector } from "react-redux";
import {
  AttributesInfo,
  CartContent,
  CartReducer,
  PredefinedAttrebutes,
  PricesInfo,
} from "./utils/types";
import {
  productIsInCart,
  productPageProductIsNotInCart,
} from "./utils/reducers/cartSlice";

function getInitialAttributes(product: CartContent) {
  let begin = [];
  for (let i = 0; i < product.attributes.length; i++) {
    begin.push({ index: 0 });
  }
  return begin;
}

export function ProductPageWrapper() {
  const { productId } = useParams();
  const { loading, error, data } = useProduct(productId);

  if (loading) return null;
  if (error) return <>Error :</>;

  return <ProductPage product={data.product} />;
}

function ProductPage({ product }: { product: CartContent }) {
  const [currImg, setCurrImg] = useState(0);

  function changeImage(imgIndex: number) {
    setCurrImg(imgIndex);
  }

  return (
    <div className={styles.productPage}>
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
      <div className={styles.productInfo}>
        <ProductInfo product={product} />
      </div>
    </div>
  );
}

function ProductInfo({ product }: { product: CartContent }) {
  const [attributes, setAttributes] = useState(getInitialAttributes(product));
  const currency = useSelector((state: PricesInfo) => state.currency);
  const cart = useSelector((state: CartReducer) => state.cart.items);

  function preDefineAttributes(attributeIndex: number, itemIndex: number) {
    let newAttributes = attributes.map((attribute, i) => {
      if (i !== attributeIndex) return attribute;
      return { index: itemIndex };
    });
    setAttributes(newAttributes);
  }

  function handleAddToCart(product: CartContent) {
    if (cart.length > 0) {
      let foundInCart = cart.find(
        (cartItem) => cartItem.id === product.id && isSame(cartItem)
      );
      if (foundInCart) {
        if (isSame(foundInCart)) return handleProductIsInCart(foundInCart);
      }
    }
    return handleProductPageProductIsNotInCart(product, attributes);
  }

  const similarity = useRef(true);

  function isSame(foundInCart: CartContent) {
    similarity.current = true;
    foundInCart.attributes.forEach((attribute, i) => {
      attribute.items.forEach((item, itemIndex) => {
        if (itemIndex === attributes[i].index) {
          if (!item.selectedItem) {
            similarity.current = false;
          }
        }
      });
    });
    return similarity.current;
  }

  const dispatch = useDispatch();

  function handleProductIsInCart(foundInCart: CartContent) {
    dispatch(productIsInCart(foundInCart));
  }

  function handleProductPageProductIsNotInCart(
    product: CartContent,
    attributes: PredefinedAttrebutes[]
  ) {
    dispatch(productPageProductIsNotInCart({ product, attributes }));
  }

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
        return (
          price.currency.label === currency.label && (
            <div key={price.currency.label} className={styles.productPrice}>
              <p>PRICE:</p>
              <p className={styles.productPriceAmount}>
                {price.currency.symbol + price.amount}
              </p>
            </div>
          )
        );
      })}
      {!product.inStock && (
        <p className={styles.productIsOutOfStock}>Item is out of stock</p>
      )}
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
        dangerouslySetInnerHTML={{ __html: sanitize(product.description) }}
      />
    </>
  );
}

function ProductAttributes({
  product,
  attributes,
  preDefineAttributes,
}: {
  product: CartContent;
  attributes: PredefinedAttrebutes[];
  preDefineAttributes: (attributeIndex: number, itemIndex: number) => void;
}) {
  function differAttributes(attribute: AttributesInfo, i: number) {
    return (
      <>
        <p className={styles.attributeName}>{attribute.name.toUpperCase()}:</p>
        {attribute.type === "text" &&
          attribute.items.map((item, index) => {
            return (
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
            );
          })}
        {attribute.type === "swatch" &&
          attribute.items.map((item, index) => {
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
