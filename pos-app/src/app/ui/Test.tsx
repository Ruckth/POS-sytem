'use client'

import ItemCart from "./pos/ItemCart";
import { CartProvider } from "@/app/ui/CartContext";
import { Item } from "@/app/types";
import CartCard from "./pos/CartCard";


export default function Test({ items }: { items: Item[] }) {

    return (
        <CartProvider>
            <div className="grid grid-cols-2 gap-4">
                <ItemCart items={items} />
                <CartCard />
            </div>
        </CartProvider>
    );
}