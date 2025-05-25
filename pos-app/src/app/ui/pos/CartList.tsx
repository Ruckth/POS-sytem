'use client'

import { useState } from "react";
import { useCart } from "../CartContext";
import { OverStockDialog, ConfirmDeleteDialog } from "./ItemList";
import CartItemCard from "./CartCard";

export default function CartList() {
    const { state, dispatch } = useCart();
    // check if item is over stock and show alert dialog
    const [itemOverStock, setItemOverStock] = useState(false);
    const [isRemoveItemAlertOpen, setIsRemoveItemAlertOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<string | null>(null);

    const discountPrice = (price: number, discount: number, discountType: 'percentage' | 'amount') => {
        if (discountType === 'percentage') {
            return price - (price * discount / 100);
        } else {
            return price - discount;
        }
    };

    const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
        const quantity = parseInt(e.target.value);

        if (!isNaN(quantity)) {
            // Find the current item in the cart to check its stock
            const currentItemInCart = state.itemsInCart.find(i => i.item.productId === productId);

            if (currentItemInCart) {
                if (quantity <= currentItemInCart.item.stock) {
                    dispatch({ type: 'SET_QUANTITY', payload: { productId, quantity } });
                    // If the quantity is valid, ensure itemOverStock is false
                    setItemOverStock(false);
                } else {
                    // If the entered quantity exceeds stock, set itemOverStock to true
                    setItemOverStock(true);
                }
            } else {
                // If the item is not in the cart, you might want to handle this case.
                // For now, we'll assume it's always in the cart when this function is called.
                dispatch({ type: 'SET_QUANTITY', payload: { productId, quantity } });
                setItemOverStock(false); // Default to false if item not found (or handle differently based on logic)
            }
        } else {
            // Handle invalid input
            dispatch({ type: 'SET_QUANTITY', payload: { productId, quantity: 1 } });
            setItemOverStock(false); // Default to false if input is invalid
        }
    };

    const increaseQuantity = (productId: string) => {
        const currentItemInCart = state.itemsInCart.find(i => i.item.productId === productId);
        if (currentItemInCart) {
            const newQuantity = currentItemInCart.cartQuantity + 1;

            if (newQuantity <= currentItemInCart.item.stock) {
                dispatch({
                    type: 'SET_QUANTITY',
                    payload: {
                        productId: productId,
                        quantity: newQuantity
                    }
                });
            } else {
                setItemOverStock(true);
            }
        }
    };

    const decreaseQuantity = (productId: string) => {
        const currentItemInCart = state.itemsInCart.find(i => i.item.productId === productId);
        if (currentItemInCart && currentItemInCart.cartQuantity > 1) {
            dispatch({
                type: 'SET_QUANTITY',
                payload: {
                    productId,
                    quantity: currentItemInCart.cartQuantity - 1
                }
            });
        } else if (currentItemInCart && currentItemInCart.cartQuantity === 1) {
            setItemToRemove(productId);
            setIsRemoveItemAlertOpen(true);
        }
    };

    return (
        <div>
            {state.itemsInCart.map(cartItem => {
                return (
                    <CartItemCard
                        key={cartItem.item.productId}
                        cartItem={cartItem}
                        dispatch={dispatch}
                        decreaseQuantity={decreaseQuantity}
                        increaseQuantity={increaseQuantity}
                        handleQuantityInput={handleQuantityInput}
                        setIsRemoveItemAlertOpen={setIsRemoveItemAlertOpen}
                        setItemToRemove={setItemToRemove}
                        discountPrice={discountPrice}
                    />
                );
            })}
            <OverStockDialog itemOverStock={itemOverStock} setItemOverStock={setItemOverStock} />
            <ConfirmDeleteDialog
                isRemoveItemAlertOpen={isRemoveItemAlertOpen}
                setIsRemoveItemAlertOpen={setIsRemoveItemAlertOpen}
                itemToRemove={itemToRemove}
                dispatch={dispatch}
                setItemToRemove={setItemToRemove}
            />
        </div>
    );
}
