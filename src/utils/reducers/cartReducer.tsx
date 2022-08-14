import { v4 as uuidv4 } from "uuid";
import { AttributesInfo, CartContent } from "../types";

type Action =
  | showMiniCart
  | productIsInCart
  | productIsNotInCart
  | productPageProductIsNotInCart
  | decreaseCartQuantity
  | selectAttribute
  | setToEmpty;

type showMiniCart = {
  type: "showMiniCart";
};

type productIsInCart = {
  type: "productIsInCart";
  payload: { cartItemId: string; cartQuantity: number };
};

type productIsNotInCart = {
  type: "productIsNotInCart";
  payload: { attributes: AttributesInfo[] };
};

type productPageProductIsNotInCart = {
  type: "productPageProductIsNotInCart";
  payload: {
    product: { attributes: AttributesInfo[] };
    attributes: { index: number }[];
  };
};

type decreaseCartQuantity = {
  type: "decreaseCartQuantity";
  payload: { cartItemId: string; cartQuantity: number };
};

type selectAttribute = {
  type: "selectAttribute";
  payload: { id: string; attribute: { id: string }; product: CartContent };
};

type setToEmpty = {
  type: "setToEmpty";
};

let cachedCart = localStorage.getItem("cart");
function isCartCached() {
  if (cachedCart) {
    return JSON.parse(cachedCart);
  }
  return [];
}

const cart = { isActive: false, items: isCartCached() };

const maxCartQuantity = 5;

export const cartReducer = (state = cart, action: Action) => {
  switch (action.type) {
    case "showMiniCart": {
      return { ...state, isActive: !state.isActive };
    }

    case "productIsInCart": {
      let nextCart = state.items.map((cartItem: CartContent) => {
        if (cartItem.cartItemId === action.payload.cartItemId) {
          if (action.payload.cartQuantity >= maxCartQuantity) {
            return { ...action.payload, cartQuantity: Number(maxCartQuantity) };
          }
          return {
            ...action.payload,
            cartQuantity: Number(action.payload.cartQuantity + 1),
          };
        }
        return cartItem;
      });
      return { ...state, items: nextCart };
    }

    case "productIsNotInCart": {
      let newAttributes = action.payload.attributes.map(
        (attribute: AttributesInfo) => {
          let newItems = attribute.items.map((item, i) => {
            if (i === 0) {
              return { ...item, selectedItem: true };
            }
            return item;
          });
          return { ...attribute, items: newItems };
        }
      );
      return {
        ...state,
        items: [
          ...state.items,
          {
            ...action.payload,
            attributes: newAttributes,
            cartItemId: uuidv4(),
            cartQuantity: 1,
          },
        ],
      };
    }

    case "productPageProductIsNotInCart": {
      let newAttributes = action.payload.product.attributes.map(
        (attribute: AttributesInfo, i: number) => {
          let newItems = attribute.items.map((item, index) => {
            if (index === action.payload.attributes[i].index) {
              return { ...item, selectedItem: true };
            }
            return item;
          });
          return { ...attribute, items: newItems };
        }
      );
      return {
        ...state,
        items: [
          ...state.items,
          {
            ...action.payload.product,
            attributes: newAttributes,
            cartItemId: uuidv4(),
            cartQuantity: 1,
          },
        ],
      };
    }

    case "decreaseCartQuantity": {
      if (action.payload.cartQuantity > 1) {
        let decreased = state.items.map((cartItem: CartContent) => {
          if (cartItem.cartItemId === action.payload.cartItemId) {
            return {
              ...cartItem,
              cartQuantity: Number(cartItem.cartQuantity) - 1,
            };
          }
          return cartItem;
        });
        return { ...state, items: decreased };
      }

      return {
        ...state,
        items: state.items.filter(
          (cartItem: CartContent) =>
            cartItem.cartItemId !== action.payload.cartItemId
        ),
      };
    }

    case "selectAttribute": {
      let changedProduct = state.items.find(
        (cartItem: CartContent) =>
          cartItem.cartItemId === action.payload.product.cartItemId
      );
      let nextCart = state.items.map((cartItem: CartContent) => {
        if (cartItem.cartItemId !== changedProduct.cartItemId) {
          return cartItem;
        }
        let nextAttribute = cartItem.attributes.map((foundAttribute) => {
          if (foundAttribute.id !== action.payload.attribute.id) {
            return foundAttribute;
          }
          let nextAttributeItem = foundAttribute.items.map(
            (foundAttributeItem) => {
              if (foundAttributeItem.id === action.payload.id) {
                return { ...foundAttributeItem, selectedItem: true };
              }
              return {
                displayValue: foundAttributeItem.displayValue,
                value: foundAttributeItem.value,
                id: foundAttributeItem.id,
              };
            }
          );
          return { ...foundAttribute, items: nextAttributeItem };
        });
        return { ...cartItem, attributes: nextAttribute };
      });
      return { ...state, items: nextCart };
    }

    case "setToEmpty": {
      return { ...state, items: [] };
    }

    default: {
      return state;
    }
  }
};
