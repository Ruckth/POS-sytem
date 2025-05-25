'use client'

import ItemCart from "./pos/ItemList";
import { CartProvider } from "@/app/ui/CartContext";
import CartList from "./pos/CartList";
import Summary from "./pos/Summary";
import { Item } from "../types";
export default function Pos({ items }: { items: Item[] }) {
    return (
        <CartProvider>
            <div className="flex flex-col xl:grid grid-cols-10 ">
                {/* left scroll */}
                <div className="col-span-6 flex flex-col p-4 xl:overflow-y-auto xl:h-screen"> 
                    <ItemCart items={items} />
                </div>

                {/* right scroll */}
                <div className="col-span-4 flex flex-col p-4 xl:overflow-y-auto xl:h-screen"> 
                    <CartList />
                    <Summary />
                </div>
            </div>
            
        </CartProvider>
    );
}