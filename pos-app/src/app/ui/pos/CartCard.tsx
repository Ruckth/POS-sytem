import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { ItemInCart } from "@/app/types";
import { TbTruckDelivery } from "react-icons/tb";
import { MdDelete } from "react-icons/md";


interface CartItemCardProps {
    cartItem: ItemInCart;
    dispatch: Function;
    decreaseQuantity: (productId: string) => void;
    increaseQuantity: (productId: string) => void;
    handleQuantityInput: (e: React.ChangeEvent<HTMLInputElement>, productId: string) => void;
    setIsRemoveItemAlertOpen: (open: boolean) => void;
    setItemToRemove: (productId: string) => void;
    discountPrice: (price: number, discount: number, type: "amount" | "percentage") => number;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
    cartItem,
    dispatch,
    decreaseQuantity,
    increaseQuantity,
    handleQuantityInput,
    setIsRemoveItemAlertOpen,
    setItemToRemove,
    discountPrice,
}) => {
    // Helper function to format currency with commas
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'THB' 
        }).format(amount);
    }

    const basePrice = cartItem.item.price;
    const hasDiscount = Number(cartItem.discount ?? 0) > 0 && cartItem.discountType;
    const finalUnitPrice = hasDiscount
        ? discountPrice(basePrice, Number(cartItem.discount), cartItem.discountType!)
        : basePrice;
    const totalPrice = finalUnitPrice * cartItem.cartQuantity;

    return (
        <div className="border border-gray-200 p-5 mb-4 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
            {/* Product Header */}
            <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                    <Image
                        src={cartItem.item.imageUrl}
                        alt={cartItem.item.productName}
                        width={120}
                        height={80}
                        className="rounded-lg object-cover border border-gray-100"
                    />
                     {cartItem.delivery && (
                        <div className="absolute -top-2 -right-2 flex text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                           <TbTruckDelivery /> Enabled
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {cartItem.item.productName}
                    </h3>

                    {/* Price Information */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Unit Price:</span>
                            {hasDiscount ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 line-through text-sm">
                                        {formatCurrency(basePrice)}
                                    </span>
                                    <span className="text-green-600 font-semibold">
                                        {formatCurrency(finalUnitPrice)}
                                    </span>
                                </div>
                            ) : (
                                <span className="font-semibold text-gray-900">
                                    {formatCurrency(basePrice)}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Total:</span>
                            <span className="font-bold text-md text-blue-600">
                                {formatCurrency(totalPrice)}
                            </span>
                            {cartItem.cartQuantity > 1 && (
                                <span className="text-xs text-gray-500">
                                    (×{cartItem.cartQuantity})
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            <div className="flex flex-col gap-4 xl:flex-row xl:gap-10">
                {/* Quantity Controls */}
                <div className="xl:mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => decreaseQuantity(cartItem.item.productId)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Decrease quantity"
                        >
                            −
                        </button>

                        <input
                            type="number"
                            value={cartItem.cartQuantity}
                            onChange={e => handleQuantityInput(e, cartItem.item.productId)}
                            min="1"
                            className="w-16 text-center border border-gray-300 rounded-lg py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        <button
                            onClick={() => increaseQuantity(cartItem.item.productId)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                            title="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="mb-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apply Discount
                    </label>
                    <div className="flex items-center gap-3">
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
                            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="amount">Fixed Amount (฿)</option>
                            <option value="percentage">Percentage (%)</option>
                        </select>

                        <div className="relative">
                            <input
                                type="number"
                                placeholder={cartItem.discountType === 'percentage' ? '0-100' : '0.00'}
                                step={cartItem.discountType === 'percentage' ? '1' : '0.01'}
                                min="0"
                                max={
                                    cartItem.discountType === 'percentage'
                                        ? 100
                                        : cartItem.discountType === 'amount'
                                            ? cartItem.item.price
                                            : undefined
                                }
                                value={cartItem.discount ?? ""}
                                onChange={e =>
                                    dispatch({
                                        type: 'SET_DISCOUNT',
                                        payload: {
                                            productId: cartItem.item.productId,
                                            discount: e.target.value === '' ? '' : (isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)),
                                            discountType: cartItem.discountType ?? 'amount',
                                        },
                                    })
                                }
                                className="w-24 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {cartItem.discountType === 'percentage' && (
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                                    %
                                </span>
                            )}
                        </div>

                        {hasDiscount && (
                            <button
                                onClick={() =>
                                    dispatch({
                                        type: 'SET_DISCOUNT',
                                        payload: {
                                            productId: cartItem.item.productId,
                                            discount: 0,
                                            discountType: cartItem.discountType ?? 'amount',
                                        },
                                    })
                                }
                                className="text-xs text-red-500 hover:text-red-700 underline"
                                title="Clear discount"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {hasDiscount && (
                        <div className="mt-2 text-sm text-green-600">
                            save: {formatCurrency((basePrice - finalUnitPrice) * cartItem.cartQuantity)}
                        </div>
                    )}
                </div>
            </div>


            <div className="flex flex-row justify-between">
                {/* Delivery Option */}
                <div className="mb-4 flex items-center justify-between p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <TbTruckDelivery />
                        <span className="text-sm font-medium text-gray-700 pr-1">
                        Delivery Service
                        </span>
                    </div>
                    <Switch
                        checked={cartItem.delivery ?? false}
                        onCheckedChange={(checked) =>
                            dispatch({
                                type: 'SET_DELIVERY',
                                payload: {
                                    productId: cartItem.item.productId,
                                    delivery: checked,
                                },
                            })
                        }
                    />
                </div>

                {/* Remove Button */}
                <div className=" border-gray-200">
                    <button
                        className="flex items-center gap-2  p-3 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                        onClick={() => {
                            setIsRemoveItemAlertOpen(true);
                            setItemToRemove(cartItem.item.productId);
                        }}
                    >
                        <MdDelete />
                         Remove from cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItemCard;