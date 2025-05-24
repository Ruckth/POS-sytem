'use client'
import { useCart } from "../CartContext";

export default function CartCard() {
    const { state, dispatch } = useCart();
    const discountPrice = (price: number, discount: number, discountType: 'percentage' | 'amount') => {
        if (discountType === 'percentage') {
            return price - (price * discount / 100);
        } else {
            return price - discount;
        }
    }
    
    return (
        <div>
            {state.itemsInCart.map(cartItem => (
                <div key={cartItem.item.productId} className="border p-2">
                    <p>{cartItem.item.productName}</p>
                    <p>{cartItem.item.price}</p>
                    {/* show discount price */}
                    {cartItem.discount && cartItem.discountType && (
                        <p>{discountPrice(cartItem.item.price, cartItem.discount, cartItem.discountType)}</p>
                    )}
                    {/* show total price */}
                    {cartItem.discount && cartItem.discountType ? (
                        <p>{discountPrice(cartItem.item.price, cartItem.discount, cartItem.discountType) * cartItem.cartQuantity}</p>
                    ):(
                        <p>{cartItem.item.price * cartItem.cartQuantity}</p>
                    )}

                    
    
                    <input
                        type="number"
                        value={cartItem.cartQuantity}
                        onChange={e =>
                            dispatch({
                                type: 'SET_QUANTITY',
                                payload: { productId: cartItem.item.productId, quantity: parseInt(e.target.value) },
                            })
                        }
                    />
                    <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: cartItem.item.productId })}>
                        Remove
                    </button>

                    {/* Show only if item is in cart */}
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
                    >
                        <option value="amount">Amount</option>
                        <option value="percentage">Percentage</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Discount"
                        onChange={e =>
                            dispatch({
                                type: 'SET_DISCOUNT',
                                payload: {
                                    productId: cartItem.item.productId,
                                    discount: parseFloat(e.target.value),
                                    discountType: cartItem.discountType?? 'amount',
                                },
                            })
                        }
                    />
                    <label>
                        Delivery:
                        <input
                            type="checkbox"
                            checked={cartItem.delivery ?? false}
                            onChange={e =>
                                dispatch({
                                    type: 'SET_DELIVERY',
                                    payload: { productId: cartItem.item.productId, delivery: e.target.checked },
                                })
                            }
                        />
                    </label>
                </div>
            ))}
        </div>
    );
};