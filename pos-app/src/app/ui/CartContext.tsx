import { createContext, useContext, useReducer, ReactNode } from "react";
import { Item, ItemInCart } from "@/app/types";

type CartState = {
  itemsInCart: ItemInCart[];
};


type Action =
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'REMOVE_ITEM'; payload: string } // Product ID
  | { type: 'SET_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'SET_DISCOUNT'; payload: { productId: string; discount: number; discountType: 'percentage' | 'amount' } }
  | { type: 'SET_DELIVERY'; payload: { productId: string; delivery: boolean } };


// Initial cart context   
const CartContext = createContext<{
  state: CartState; // State of the cart
  dispatch: React.Dispatch<Action>; // Dispatch function to update the cart state
} | null>(null); // or null if not initialized

// Set up the cart reducer to handle cart state updates
const cartReducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      if (state.itemsInCart.find(i => i.item.productId === action.payload.productId)) return state;
      return {
        ...state,
        itemsInCart: [...state.itemsInCart, { item: action.payload, cartQuantity: 1 }],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        itemsInCart: state.itemsInCart.filter(i => i.item.productId !== action.payload),
      };
    case 'SET_QUANTITY':
      return {
        ...state,
        itemsInCart: state.itemsInCart.map(i =>
          i.item.productId === action.payload.productId
            ? { ...i, cartQuantity: action.payload.quantity }
            : i
        ),
      };
    case 'SET_DISCOUNT':
      return {
        ...state,
        itemsInCart: state.itemsInCart.map(i =>
          i.item.productId === action.payload.productId
            ? {
              ...i,
              discount: action.payload.discount,
              discountType: action.payload.discountType,
            }
            : i
        ),
      };
    case 'SET_DELIVERY':
      return {
        ...state,
        itemsInCart: state.itemsInCart.map(i =>
          i.item.productId === action.payload.productId
            ? { ...i, delivery: action.payload.delivery }
            : i
        ),
      };
    default:
      return state;
  }
};
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { itemsInCart: [] });

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};