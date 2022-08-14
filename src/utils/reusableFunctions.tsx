import { CartContent, CurrencyInfo } from "../utils/types";

export function getCartQuantity(cart: CartContent[]) {
  return cart.reduce((total, current) => total + current.cartQuantity, 0);
}

export function getPercentOfCartTotal(
  percent: number,
  cart: CartContent[],
  currency: CurrencyInfo
) {
  let total = 0;

  cart.forEach((cartItem) => {
    let itemPrice: number = 0;

    cartItem.prices.forEach((price) => {
      if (price.currency.label === currency.label) {
        itemPrice = price.amount;
      }
    });

    return (total += cartItem.cartQuantity * itemPrice);
  });
  return currency.symbol + Math.round(total * (percent / 100) * 100) / 100;
}
