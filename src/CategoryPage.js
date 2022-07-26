import { Link } from "react-router-dom";

export function CategoryPage({ category, currency, handleAddToCart }) {
  return (
    <>
      <div className="CategoryPage">
        <h1> Category: {category.name}</h1>
        <div className="productList">
          {category.products.map((product) => {
            return (
              <Link
                to={product.id}
                className={product.inStock ? "product" : "outOfStockProduct"}
                key={product.id}
              >
                {product.inStock ? null : (
                  <p className="outOfStockMessage">OUT OF STOCK</p>
                )}
                <img
                  className="productImg"
                  src={product.gallery[0]}
                  alt={product.name}
                />
                <button
                  className="addToCartButton"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(product);
                  }}
                />
                <div className="productInfo">
                  <p>{product.name}</p>
                  {product.prices.map((price) => {
                    if (price.currency.label === currency) {
                      return (
                        <p key={price.currency.label}>
                          <b>{price.currency.symbol + price.amount}</b>
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
