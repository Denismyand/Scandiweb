import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { AttributesInfo, CartContent } from "../types";

let cachedCart = localStorage.getItem("cart");
function isCartCached() {
  if (cachedCart) {
    return JSON.parse(cachedCart);
  }
  return [];
}

const cart = { isActive: false, items: isCartCached() };

const maxCartQuantity = 5;

const cartSlice = createSlice({
  name: "cart",
  initialState: cart,
  reducers: {
    showMiniCart(state) {
      return { ...state, isActive: !state.isActive };
    },
    productIsInCart(state, action) {
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
    },
    productIsNotInCart(state, action) {
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
    },
    productPageProductIsNotInCart(state, action) {
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
    },
    decreaseCartQuantity(state, action) {
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
    },
    selectAttribute(state, action) {
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
    },
    setToEmpty(state) {
      return { ...state, items: [] };
    },
  },
});

export default cartSlice.reducer;
export const {
  showMiniCart,
  productIsInCart,
  productIsNotInCart,
  productPageProductIsNotInCart,
  decreaseCartQuantity,
  selectAttribute,
  setToEmpty,
} = cartSlice.actions;
