import React, { createContext, useReducer, useContext, useEffect } from 'react';

// Типы действий
const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';

const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
  totalItems: 0,
  totalPrice: 0,
};

const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalPrice };
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_ITEM: {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      let updatedItems;
      if (existingItemIndex > -1) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      const totals = calculateTotals(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return { ...state, items: updatedItems, ...totals };
    }
    case REMOVE_ITEM: {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const totals = calculateTotals(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return { ...state, items: updatedItems, ...totals };
    }
    case UPDATE_QUANTITY: {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
      const totals = calculateTotals(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return { ...state, items: updatedItems, ...totals };
    }
    case CLEAR_CART:
      localStorage.removeItem('cart');
      return { ...state, items: [], totalItems: 0, totalPrice: 0 };
    default:
      return state;
  }
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const totals = calculateTotals(state.items);
    if (totals.totalItems !== state.totalItems || totals.totalPrice !== state.totalPrice) {
        // This is a safety net, shouldn't be needed if reducer works correctly
    }
  }, [state.items]);

  const addItem = (item) => dispatch({ type: ADD_ITEM, payload: item });
  const removeItem = (id) => dispatch({ type: REMOVE_ITEM, payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: UPDATE_QUANTITY, payload: { id, quantity } });
  const clearCart = () => dispatch({ type: CLEAR_CART });

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};