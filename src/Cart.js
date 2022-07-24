import "./cart.css";

export function MiniCart({
  cart,
  currency,
  currencySign,
  handleSelectAttribute,
  handleAddToCart,
  handleDecreaseCartQuantity,
}) {
  function getCartQuantity() {
    let total = 0;

    cart.map((cartItem) => (total += cartItem.cartQuantity));
    return total;
  }

  function getCartTotal() {
    let total = 0;

    cart.map((cartItem) => {
      let itemPrice;

      cartItem.prices.map((price) => {
        if (price.currency.label === currency) {
          itemPrice = price.amount;
        }
        return null;
      });

      return (total += cartItem.cartQuantity * itemPrice);
    });
    return currencySign + Math.round(total * 100) / 100;
  }

  return (
    <div className="MiniCart">
      {cart.length > 0 ? (
        <>
          <b>My cart.</b> <span>{getCartQuantity()} items</span>
          <div className="miniCartItemList">
            {cart.map((cartItem) => {
              return (
                <div className="miniCartItem" key={cartItem.id}>
                  <div className="miniCartItemInfo">
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
                    <ProductAttributes
                      product={cartItem}
                      handleSelectAttribute={handleSelectAttribute}
                    />
                  </div>
                  <div className="miniCartItemQuantity">
                    <button
                      className="miniCartIncreaseQtyButton"
                      onClick={() => handleAddToCart(cartItem)}
                    />
                    <p className="miniCartQtyNumber">{cartItem.cartQuantity}</p>
                    <button
                      className="miniCartDecreaseQtyButton"
                      onClick={() => handleDecreaseCartQuantity(cartItem)}
                    />
                  </div>
                  <img
                    className="miniCartItemPicture"
                    src={cartItem.gallery[0]}
                    alt={cartItem.name}
                  />
                </div>
              );
            })}
          </div>
          <div className="miniCartTotal">
            <div className="miniCartTotalLeft">
              <b>Total</b>
            </div>
            <div className="miniCartTotalRight">
              <b>{getCartTotal()}</b>
            </div>
          </div>
        </>
      ) : (
        <h1>Your cart is empty</h1>
      )}
    </div>
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
                "textAttributeSelectButton" +
                (item.selectedItem ? " activeTextAttribute" : "")
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
                  "swatchAttributeSelectButton" +
                  (item.selectedItem ? " activeSwatchAttribute" : "")
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
