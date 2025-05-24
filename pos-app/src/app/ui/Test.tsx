'use client'

import ItemCart from "./pos/ItemList";
import { CartProvider } from "@/app/ui/CartContext";
import { Item } from "@/app/types";
import CartCard from "./pos/CartCard";
import Summary from "./pos/Summary";


export default function Test({ items }: { items: Item[] }) {

    return (
        <CartProvider>
            <div className="grid grid-cols-2 gap-4">
                <ItemCart items={items} />
                <div className="flex flex-col">
                    <CartCard />
                    <Summary />
                </div>
            </div>
        </CartProvider>
    );
}