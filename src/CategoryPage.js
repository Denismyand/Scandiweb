import { Link, useParams } from "react-router-dom";
import { useCategory } from "./utils/request.js";

export function CategoryPage({ currency, handleAddToCart }) {
  const { categoryName } = useParams();

  const { loading, error, data } = useCategory(categoryName);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  const category = data.category;
  return (
    <>
      <div className="categoryPage">
        <h1> Category: {category.name}</h1>
        <div className="productList">
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
      </div>
    </>
  );
}

function Product({ product, currency, handleAddToCart }) {
  return (
    <Link
      to={product.id}
      className={product.inStock ? "product" : "outOfStockProduct"}
    >
      {product.inStock ? null : (
        <p className="outOfStockMessage">OUT OF STOCK</p>
      )}
      <img className="productImg" src={product.gallery[0]} alt={product.name} />
      <button
        className="addToCartButton"
        onClick={(e) => {
          e.preventDefault();
          handleAddToCart(product);
        }}
      />
      <div className="productInfo">
        <p>{product.brand + " " + product.name}</p>
        {product.prices.map((price) => {
          return (
            price.currency.label === currency.label && (
              <p key={price.currency.label}>
                <b className="price">{price.currency.symbol + price.amount}</b>
              </p>
            )
          );
        })}
      </div>
    </Link>
  );
}
