/** @format */

import * as actionTypes from "../constants/cartConstants";
import axios from "axios";

export const addToCart =
  (productId, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/seller/addProduct/${productId}`);
    dispatch({
      type: actionTypes.ADD_TO_CART,
      payload: {
        productID: data._id,
        name: data.title,
        price: data.price,
        image: data.image[0] ?? null,
        description: data.description,
        count: quantity,
        quantity,
      },
    });
    localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
  };

export const removeFromCart =
  (productID, quantity, price) => (dispatch, getState) => {
    dispatch({
      type: actionTypes.REMOVE_FROM_CART,
      payload: { productID: productID, quantity: quantity, price: price },
    });
    localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
  };
