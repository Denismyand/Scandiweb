export function getCartQuantity(cart) {
  return cart.reduce((total, current) => total + current.cartQuantity, 0);
}

export function getPercentOfCartTotal(percent, cart, currency) {
  let total = 0;

  cart.forEach((cartItem) => {
    let itemPrice;

    cartItem.prices.forEach((price) => {
      if (price.currency.label === currency.label) {
        itemPrice = price.amount;
      }
    });

    return (total += cartItem.cartQuantity * itemPrice);
  });
  return currency.symbol + Math.round(total * (percent / 100) * 100) / 100;
}
