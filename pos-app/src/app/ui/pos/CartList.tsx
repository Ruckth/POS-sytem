'use client'

import { useState } from "react";
import { useCart } from "../CartContext";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { OverStockDialog, ConfirmDeleteDialog } from "./ItemList";

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
                const basePrice = cartItem.item.price;
                const hasDiscount = cartItem.discount && cartItem.discountType;
                const finalUnitPrice = hasDiscount
                    ? discountPrice(basePrice, cartItem.discount!, cartItem.discountType!)
                    : basePrice;
                const totalPrice = finalUnitPrice * cartItem.cartQuantity;

                return (
                    <div key={cartItem.item.productId} className="border p-4 mb-4 rounded-lg shadow-sm space-y-2">
                        <div className="flex items-center gap-4">
                            <Image
                                src={cartItem.item.imageUrl}
                                alt={cartItem.item.productName}
                                width={50}
                                height={50}
                            />
                            <div>
                                <p className="font-semibold">{cartItem.item.productName}</p>
                                <p>Price: ฿{basePrice.toFixed(2)}</p>
                                {hasDiscount && (
                                    <p className="text-green-600">
                                        Discounted: ฿{finalUnitPrice.toFixed(2)}
                                    </p>
                                )}
                                <p className="font-bold">
                                    Total: ฿{totalPrice.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Quantity Control */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => decreaseQuantity(cartItem.item.productId)}
                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                −
                            </button>
                            <input
                                type="number"
                                value={cartItem.cartQuantity}
                                onChange={e => handleQuantityInput(e, cartItem.item.productId)}
                                className="w-16 text-center border rounded"
                            />
                            <button
                                onClick={() => increaseQuantity(cartItem.item.productId)}
                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                +
                            </button>
                        </div>

                        {/* Discount Type Selector */}
                        <div className="flex items-center gap-2">
                            <select
                                value={cartItem.discountType ?? 'amount'}
                                onChange={e =>
                                    dispatch({
                                        type: 'SET_DISCOUNT',
                                        payload: {
                                            productId: cartItem.item.productId,
                                            discount: cartItem.discount ?? 0,
                                            discountType: e.target.value as "percentage" | "amount",
                                        },
                                    })
                                }
                                className="border rounded p-1"
                            >
                                <option value="amount">Amount</option>
                                <option value="percentage">Percentage</option>
                            </select>

                            <input
                                type="number"
                                placeholder="Discount"
                                step="0.01"
                                defaultValue={cartItem.discount ?? ""}
                                onChange={e =>
                                    dispatch({
                                        type: 'SET_DISCOUNT',
                                        payload: {
                                            productId: cartItem.item.productId,
                                            discount: parseFloat(e.target.value),
                                            discountType: cartItem.discountType ?? 'amount',
                                        },
                                    })
                                }
                                className="w-24 border rounded p-1"
                            />
                        </div>

                        {/* Delivery Switch */}
                        <div className="flex items-center gap-2">
                            <span>Delivery:</span>
                            <Switch
                                checked={cartItem.delivery ?? false}
                                onCheckedChange={(checked) => {
                                    dispatch({
                                        type: 'SET_DELIVERY',
                                        payload: {
                                            productId: cartItem.item.productId,
                                            delivery: checked,
                                        },
                                    });
                                }}
                            />
                        </div>

                        {/* Remove Button */}
                       <button className="p-1 text-red-500 hover:underline" onClick={() => setIsRemoveItemAlertOpen(true)}>Remove</button>
    
                    </div>
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
