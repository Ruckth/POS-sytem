'use client'

import { useState } from "react";
import { useCart } from "../CartContext";


export default function Summary() {
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
    const { state } = useCart();
    const subTotal = () => {
        let total = 0;
        state.itemsInCart.forEach(cartItem => {
            if(cartItem.discountType ==='amount'){
            total += (cartItem.item.price - (cartItem.discount || 0)) * cartItem.cartQuantity;
            }else{
                total += (cartItem.item.price * (1 - (cartItem.discount || 0) / 100)) * cartItem.cartQuantity;
            }
        });
        return total;
    }

    const discountPrice = (discount: number, discountType: 'percentage' | 'amount' = 'percentage') => {
        if (discountType === 'percentage') {
            return subTotal() * discount / 100;
        } else {
            return discount;
        }
    }

    return (
        <div>
            <h1>Summary</h1>
            <p>Subtotal: {subTotal()}</p>
            <div>
            <label>Discount Type : </label>
            <select value={discountType} onChange={e => setDiscountType(e.target.value as 'percentage' | 'amount')}>
                <option value="percentage">Percentage</option>
                <option value="amount">Amount</option>
            </select>
            </div>
            <div>
            <label>Discount : </label>
            <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
            </div>
            <p>Discount: {discountPrice(discount,discountType)} </p>
            <p>Total: {subTotal()}</p>
        </div>
    )
}