import React from "react";
import { Link, useParams } from "react-router-dom";
import { useCategory } from "./utils/request";
import styles from "./styles/categorypage.module.css";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CartContent, CartReducer, PricesInfo } from "./utils/types";

export function CategoryPage() {
  const { categoryName } = useParams();

  const { loading, error, data } = useCategory(categoryName);
  if (loading) return null;
  if (error) return <>`Error! {error}`</>;
  const category = data.category;
  return (
    <>
      <div className={styles.categoryPage}>
        <h1> Category: {category.name}</h1>
        {category.products.map((product: CartContent) => {
          return <Product product={product} key={product.id} />;
        })}
      </div>
    </>
  );
}

function Product({ product }: { product: CartContent }) {
  const currency = useSelector((state: PricesInfo) => state.currency);

  const cart = useSelector((state: CartReducer) => state.cart.items);

  const dispatch = useDispatch();

  function handleAddToCart(product: CartContent) {
    if (cart.length > 0) {
      let foundInCart = cart.find(
        (cartItem: CartContent) =>
          cartItem.id === product.id && isSame(cartItem)
      );
      if (foundInCart) {
        if (isSame(foundInCart)) return handleProductIsInCart(foundInCart);
      }
    }
    return handleProductIsNotInCart(product);
  }

  const similarity = useRef(true);

  function isSame(foundInCart: CartContent) {
    similarity.current = true;
    foundInCart.attributes.forEach((attribute) => {
      attribute.items.forEach((item, itemIndex) => {
        if (itemIndex === 0) {
          if (!item.selectedItem) {
            similarity.current = false;
          }
        }
      });
    });
    return similarity.current;
  }

  function handleProductIsInCart(foundInCart: CartContent) {
    dispatch({ type: "productIsInCart", payload: foundInCart });
  }

  function handleProductIsNotInCart(product: CartContent) {
    dispatch({ type: "productIsNotInCart", payload: product });
  }

  return (
    <Link
      to={product.id}
      className={product.inStock ? styles.product : styles.outOfStockProduct}
    >
      {product.inStock ? null : (
        <p className={styles.outOfStockMessage}>OUT OF STOCK</p>
      )}
      <img
        className={styles.productImg}
        src={product.gallery[0]}
        alt={product.name}
      />
      <button
        className={styles.addToCartButton}
        onClick={(e) => {
          e.preventDefault();
          handleAddToCart(product);
        }}
      />
      <div className={styles.productInfo}>
        <p>{product.brand + " " + product.name}</p>
        {product.prices.map((price) => {
          return (
            price.currency.label === currency.label && (
              <p key={price.currency.label}>
                <b className={styles.price}>
                  {price.currency.symbol + price.amount}
                </b>
              </p>
            )
          );
        })}
      </div>
    </Link>
  );
}
