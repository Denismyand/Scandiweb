export type Prices = { prices: PricesInfo[] };

export type CartReducer = { cart: CartInfo };

export type CartInfo = { isActive: boolean; items: CartContent[] };

export type CategoryInfo = {
  name: string;
  products: CartContent[];
};

export type CartContent = {
  id: string;
  name: string;
  brand: string;
  inStock: boolean;
  gallery: string[];
  description: string;
  category: string;
  attributes: AttributesInfo[];
  cartQuantity: number;
  prices: PricesInfo[];
  cartItemId: string;
};

export type AttributesInfo = {
  index: number;
  id: string;
  name: string;
  type: string;
  items: ItemsInfo[];
};

export type PredefinedAttrebutes = Pick<AttributesInfo, "index">;

export type ItemsInfo = {
  displayValue: string;
  value: string;
  id: string;
  selectedItem: boolean;
};

export type PricesInfo = {
  currency: CurrencyInfo;
  amount: number;
};

export type CurrencyInfo = {
  isActive?: boolean;
  label: string;
  symbol: string;
};
