import { Link, useParams } from "react-router-dom";
import { useCategory } from "./utils/request.js";
import styles from "./styles/categorypage.module.css";

export function CategoryPage({ currency, handleAddToCart }) {
  const { categoryName } = useParams();

  const { loading, error, data } = useCategory(categoryName);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  const category = data.category;
  return (
    <>
      <div className={styles.categoryPage}>
        <h1> Category: {category.name}</h1>
        {category.products.map((product) => {
          return (
            <Product
              product={product}
              currency={currency}
              handleAddToCart={handleAddToCart}
              key={product.id}
            />
          );
        })}
      </div>
    </>
  );
}

function Product({ product, currency, handleAddToCart }) {
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
