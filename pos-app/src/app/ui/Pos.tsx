'use client'
import React, { useReducer, useState, } from 'react';
// import Summary from '@/app/ui/pos/Summary';
// import CartList from '@/app/ui/pos/CartList';
// import ProductList from '@/app/ui/pos/ProductList';


interface Product {
    productId: number;
    productName: string;
    stock: number;
    price: number;
    quantity?: number; // quantity of the product in the cart
    discount?: number; // discount percentage
    discountType?: 'percentage' | 'baht amount'; // type of discount 'percentage' or 'baht amount'
    delivery?: boolean; // delivery option
}
interface BillDiscount {
    type: 'percent' | 'baht';
    value: number;
}

const actionTypes = {
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    CLEAR_CART: 'CLEAR_CART',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    REMOVE_DISCOUNT: 'REMOVE_DISCOUNT',
    UPDATE_DISCOUNT: 'UPDATE_DISCOUNT',
    UPDATE_DISCOUNT_TYPE: 'UPDATE_DISCOUNT_TYPE',
}




const initialState: Product[] = [];

const cartReducer = (state: Product[], action: { type: string; payload: Product }): Product[] => {
    switch (action.type) {
        case actionTypes.ADD_ITEM:
            const existingItem = state.find(item => item.productId === action.payload.productId);
            if (existingItem) {
                return state.map(item =>
                    item.productId === action.payload.productId
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item
                );
            }
            return [...state, { ...action.payload, quantity: 1 }];
        case actionTypes.UPDATE_QUANTITY:
            return state.map(item =>
                item.productId === action.payload.productId
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
        case actionTypes.REMOVE_ITEM:
            return state.filter(item => item.productId !== action.payload.productId);
        case actionTypes.REMOVE_DISCOUNT:
            return state.map(item =>
                item.productId === action.payload.productId
                    ? { ...item, discount: undefined }
                    : item
            );
        // Discount 
        // Discount Type
        case actionTypes.UPDATE_DISCOUNT:
            console.log([state])
            return state.map(item =>
                item.productId === action.payload.productId
                    ? { ...item, discount: action.payload.discount }
                    : item
            );
        case actionTypes.CLEAR_CART:
            return [];
        default:
            console.log([state])
            return state;
    }
};

const itemArr: Product[] = [
    {
        productId: 1,
        productName: 'Chicken',
        stock: 10,
        price: 100
    },
    {
        productId: 2,
        productName: 'Pork',
        stock: 15,
        price: 200
    },
];

export default function Pos() {
    const [cartItems, dispatch] = useReducer(cartReducer, initialState);
    const [billDiscount, setBillDiscount] = useState<BillDiscount | null>(null);

    const addItem = (product: Product) => {
        dispatch({ type: actionTypes.ADD_ITEM, payload: product });
    };

    const incrementItem = (product: Product) => {
        const currentItem = cartItems.find(item => item.productId === product.productId);
        const currentQuantity = currentItem?.quantity || 0;

        if (currentQuantity < product.stock) {
            dispatch({ type: actionTypes.ADD_ITEM, payload: product });
        } else {
            alert(`Sorry, only ${product.stock} items available in stock`);
        }
    };
    const decrementItem = (product: Product) => {
        const currentItem = cartItems.find(item => item.productId === product.productId);
        const currentQuantity = currentItem?.quantity || 0;
        if (currentQuantity < 1) {
            dispatch({ type: actionTypes.REMOVE_ITEM, payload: product });
        } else {
            dispatch({ type: actionTypes.UPDATE_QUANTITY, payload: { ...product, quantity: currentQuantity - 1 } });
        }

    }

    const removeItem = (product: Product) => {
        dispatch({ type: actionTypes.REMOVE_ITEM, payload: product });
    };

    const clearCart = () => {
        dispatch({ type: actionTypes.CLEAR_CART, payload: {} as Product });
    };

    const isItemInCart = (product: Product) => {
        return cartItems.some(item => item.productId === product.productId);
    };

    const decrementItemQuantity = (product: Product) => {
        const currentItem = cartItems.find(item => item.productId === product.productId);
        const currentQuantity = currentItem?.quantity || 0;
        if (currentQuantity > 1) {
            dispatch({ type: actionTypes.UPDATE_QUANTITY, payload: { ...product, quantity: currentQuantity - 1 } });
        } else {
            dispatch({ type: actionTypes.REMOVE_ITEM, payload: product });
        }
    }
    const removeDiscount = (product: Product) => {
        dispatch({ type: actionTypes.REMOVE_DISCOUNT, payload: product });
    }
    const updateDiscount = (product: Product, discount: number) => {
        dispatch({ type: actionTypes.UPDATE_DISCOUNT, payload: { ...product, discount } });
    };

    // price for each item
    const unitPrice = (item: Product) => {
        const discountAmount = item.price * ((item.discount || 0) / 100);
        return item.price - discountAmount;
    };

    // Subtotal before bill discount
    const subtotal = cartItems.reduce((total, item) => {
        const discountAmount = item.price * ((item.discount || 0) / 100);
        const itemTotal = (item.price - discountAmount) * (item.quantity || 1);
        return total + itemTotal;
    }, 0);
    // Calculate bill discount amount
    const calculateBillDiscountAmount = () => {
        if (!billDiscount) return 0;

        if (billDiscount.type === 'percent') {
            return subtotal * (billDiscount.value / 100);
        } else {
            return Math.min(billDiscount.value, subtotal); // Don't exceed subtotal
        }
    };


    // Final total after bill discount
    const totalPrice = subtotal - calculateBillDiscountAmount();

    const handleDiscountTypeChange = (type: 'percent' | 'baht') => {
        if (billDiscount) {
            setBillDiscount({
                ...billDiscount,
                type: type
            });
        }
    };
    // Handle discount value change
    const handleDiscountValueChange = (value: string) => {
        const discountValue = parseFloat(value);

        if (value === '' || isNaN(discountValue)) {
            setBillDiscount(null);
            return;
        }

        if (discountValue < 0) {
            return; // Don't allow negative values
        }

        const discountType = billDiscount?.type || 'percent';

        // Validate percentage
        if (discountType === 'percent' && discountValue > 100) {
            return; // Don't allow percentage > 100
        }

        // Validate baht amount
        if (discountType === 'baht' && discountValue > subtotal) {
            return; // Don't allow discount > subtotal
        }

        setBillDiscount({
            type: discountType,
            value: discountValue
        });
    };


    // Function to remove bill discount
    const removeBillDiscount = () => {
        setBillDiscount(null);
    };


    return (
        <div>
            <div>
                <h1 className='text-2xl'>Products</h1>
                {itemArr.map(product => (
                    <div key={product.productId} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                        <h3>{product.productName}</h3>
                        <p>Price: ${product.price}</p>
                        <p>Stock: {product.stock}</p>
                        {isItemInCart(product) ? (
                            <div className='flex gap-10'>
                                <button
                                    onClick={() => incrementItem(product)}
                                    disabled={(cartItems.find(item => item.productId === product.productId)?.quantity || 0) >= product.stock}
                                >
                                    +
                                </button>
                                {(cartItems.find(item => item.productId === product.productId)?.quantity || 0)}
                                {(cartItems.find(item => item.productId === product.productId)?.quantity || 0) > 1 ? (
                                    <button
                                        onClick={() => decrementItem(product)}
                                        disabled={(cartItems.find(item => item.productId === product.productId)?.quantity || 0) <= 1}
                                    >
                                        -
                                    </button>
                                ) : <button onClick={() => removeItem(product)}>Remove</button>}

                            </div>
                        ) : (
                            <button
                                onClick={() => addItem(product)}
                                disabled={(cartItems.find(item => item.productId === product.productId)?.quantity || 0) >= product.stock}
                            >
                                Add to Cart
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={clearCart}>Clear Cart</button>
                <hr />

                <h2 className='text-2xl mt-4'>Your Cart</h2>
                {cartItems.map(item => (
                    <div key={item.productId} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                        <h3>{item.productName}</h3>
                        <p>Price: ${item.price}</p>
                        {(Number(unitPrice(item)) > 0) &&
                            (<div className='flex flex-col gap-2'>
                                <p>Discount: ${item.discount}</p>
                                <p>Unit Price: ${unitPrice(item)}</p>
                            </div>
                            )}
                        <div className='flex gap-10'>
                            <button
                                onClick={() => incrementItem(item)}
                                disabled={(item.quantity || 0) >= item.stock}
                            >
                                +
                            </button>
                            <p>{item.quantity}</p>
                            <button
                                onClick={() => decrementItemQuantity(item)}
                            >
                                -
                            </button>
                            <button onClick={() => removeItem(item)}>Remove</button>
                        </div>
                        <div className='mt-4 flex flex-col gap-4'>
                            <button onClick={() => updateDiscount(item, 10)}>Apply 10% Discount</button>
                            <button onClick={() => removeDiscount(item)}>Remove Discount</button>
                        </div>
                    </div>
                ))}
                <div>
                    <div className="p-4">
                        {/* Your existing cart UI components here */}

                        {/* Price Summary */}
                        <div className="mt-6 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>฿{subtotal.toFixed(2)}</span>
                            </div>

                            {billDiscount && (
                                <div className="flex justify-between text-green-600">
                                    <span>
                                        Bill Discount ({billDiscount.type === 'percent' ? `${billDiscount.value}%` : `฿${billDiscount.value}`}):
                                        <button
                                            onClick={removeBillDiscount}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                            title="Remove discount"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                    <span>-฿{calculateBillDiscountAmount().toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total:</span>
                                <span>฿{totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Bill Discount Form */}
                        <div className=''>
                            <p className="text-lg font-semibold">ส่วนลดท้าย bill:</p>
                            <div className="flex gap-4 items-center">
                                <select
                                    value={billDiscount?.type || 'percent'}
                                    onChange={(e) => handleDiscountTypeChange(e.target.value as 'percent' | 'baht')}
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="percent">Percent (%)</option>
                                    <option value="baht">Baht (฿)</option>
                                </select>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max={billDiscount?.type === 'percent' ? 100 : subtotal}
                                    placeholder="Enter discount amount"
                                    value={billDiscount?.value || ''}
                                    onChange={(e) => handleDiscountValueChange(e.target.value)}
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                {billDiscount && (
                                    <button
                                        type="button"
                                        onClick={removeBillDiscount}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {billDiscount && (
                                <div className="text-sm text-gray-600">
                                    Current discount: {billDiscount.type === 'percent' ? `${billDiscount.value}%` : `฿${billDiscount.value}`}
                                    = ฿{calculateBillDiscountAmount().toFixed(2)} off
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-4 '>
                {/* <ProductList  /> */}
                {/* <CartList />
                <Summary /> */}
            </div>
        </div>
    );
}