'use client'

import ItemCart from "./pos/ItemList";
import { CartProvider } from "@/app/ui/CartContext";
import CartList from "./pos/CartList";
import Summary from "./pos/Summary";
import { Item } from "../types";
export default function Pos({ items }: { items: Item[] }) {
    return (
        <CartProvider>
            <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                <ItemCart items={items} />
                <div className="flex flex-col">
                    <CartList />
                    <Summary />
                </div>
            </div>
        </CartProvider>
    );
}