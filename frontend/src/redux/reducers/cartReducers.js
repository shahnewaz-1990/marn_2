/** @format */

import * as actionTypes from "../constants/cartConstants";

const CART_INITIAL_STATE = {
  cartItems: [],
  itemsCount: 0,
  cartSubtotal: 0,
};

const calculateTotal = (cartItems) => {
  return cartItems.reduce((total, item) => {
    console.log(total);
    return total + item.quantity * item.price;
  }, 0);
};

export const cartReducer = (state = CART_INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART:
      const productBeingAddedToCart = action.payload;

      const productAlreadyExistsInState = state.cartItems.find(
        (x) => x.productID === productBeingAddedToCart.productID
      );

      if (productAlreadyExistsInState) {
        const updatedCartItems = state.cartItems.map((x) => {
          if (x.productID === productBeingAddedToCart.productID) {
            const newQuantity =
              productBeingAddedToCart.quantity > 0
                ? x.quantity + productBeingAddedToCart.quantity * 1
                : productBeingAddedToCart.quantity * -1;
            return {
              ...x,
              count: x.quantity,
              quantity: newQuantity,
            };
          } else {
            return x;
          }
        });
        console.log(updatedCartItems[0]);
        const newItemsCount = updatedCartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
        const newCartSubtotal = calculateTotal(updatedCartItems);
        return {
          ...state,
          cartItems: updatedCartItems,
          itemsCount: newItemsCount,
          cartSubtotal: newCartSubtotal,
        };
      } else {
        return {
          ...state,
          cartItems: [
            ...state.cartItems,
            { ...productBeingAddedToCart, quantity: 1 },
          ],
          itemsCount:
            productBeingAddedToCart.quantity > 0
              ? state.itemsCount + productBeingAddedToCart.quantity * 1
              : state.itemsCount -
                productBeingAddedToCart.count +
                productBeingAddedToCart.quantity,
          cartSubtotal:
            state.cartSubtotal +
            productBeingAddedToCart.quantity * productBeingAddedToCart.price,
        };
      }

    case actionTypes.REMOVE_FROM_CART:
      const productBeingRemovedFromCart = action.payload;

      const updatedCartItems = state.cartItems.filter(
        (x) => x.productID !== productBeingRemovedFromCart.productID
      );

      const newItemsCount = updatedCartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      const newCartSubtotal = calculateTotal(updatedCartItems);

      return {
        ...state,
        cartItems: updatedCartItems,
        itemsCount: newItemsCount,
        cartSubtotal: newCartSubtotal,
      };

    default:
      return state;
  }
};
