'use client'

import { useState } from "react";
import { useCart } from "../CartContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";

export default function Summary() {
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
    const { state } = useCart();

    const subTotal = () => {
        let total = 0;
        state.itemsInCart.forEach(cartItem => {
            if (cartItem.discountType === 'amount') {
                total += (cartItem.item.price - (cartItem.discount || 0)) * cartItem.cartQuantity;
            } else {
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

    const totalQuantity = () => {
        let total = 0;
        state.itemsInCart.forEach(cartItem => {
            total += cartItem.cartQuantity;
        });
        return total;
    }

    const vatAmount = () => subTotal() * 0.07;

    const totalPrice = () => {
        return subTotal() - discountPrice(discount, discountType) + vatAmount();
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'THB'
        }).format(amount);
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 ">
            {/* Header */}
            <div className="text-left mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Summary</h2>
                <div className="h-0.5 bg-blue-400 round-2xl"></div>
            </div>
            {/* Items Info */}
            <div className="mb-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Items in cart</span>
                    <span className="font-semibold text-gray-600">{totalQuantity()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Before Vat</span>
                    <span className=" text-gray-600">{formatCurrency(subTotal())}</span>
                </div>
                <div className="flex justify-between items-center py-2 text-gray-600 border-b border-gray-100">
                    <span>VAT (7%)</span>
                    <span>{formatCurrency(vatAmount())}</span>
                </div>
            </div>

            {/* Discount Section */}
            <div className=" rounded-lg mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Apply Discount</h3>
                <div className="flex items-center gap-3">
                    <Select value={discountType} onValueChange={(value) => setDiscountType(value as 'percentage' | 'amount')}>
                        <SelectTrigger>
                            <SelectValue>{discountType === 'percentage' ? 'Percentage (%)' : 'Fixed Amount ($)'}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                            <SelectItem value="amount"> Amount (฿)</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        type="number"
                        value={discount}
                        onChange={e => setDiscount(Number(e.target.value))}
                        placeholder="Enter discount"
                        className="w-50"
                    />
                </div>
                {discount > 0 && (
                    <div className="flex justify-between items-center font-semibold text-green-600 px-2 py-1">
                        <span>Discount</span>
                        <span>-{formatCurrency(discountPrice(discount, discountType))}</span>
                    </div>
                )}
            </div>
            {/* Total */}
            <div className="border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(totalPrice())}
                    </span>
                </div>
            </div>

            {/* Action Button */}
            <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Proceed to Checkout
            </button>
        </div>
    )
}