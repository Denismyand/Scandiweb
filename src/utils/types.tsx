export type prices = { prices: pricesInfo[] };

export type cartReducer = { cart: cartInfo };

export type cartInfo = { isActive: boolean; items: cartContent[] };

export type categoryInfo = {
  name: string;
  products: cartContent[];
};

export type cartContent = {
  id: string;
  name: string;
  brand: string;
  inStock: boolean;
  gallery: string[];
  description: string;
  category: string;
  attributes: attributesInfo[];
  cartQuantity: number;
  prices: pricesInfo[];
  cartItemId: string;
};

export type attributesInfo = {
  id: string;
  name: string;
  type: string;
  items: itemsInfo[];
};

export type itemsInfo = {
  displayValue: string;
  value: string;
  id: string;
  selectedItem: boolean;
};

export type pricesInfo = {
  currency: currencyInfo;
  amount: number;
};

export type currencyInfo = {
  isActive?: boolean;
  label: string;
  symbol: string;
};
