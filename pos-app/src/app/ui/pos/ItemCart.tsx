'use client'

import { Item } from "@/app/types";
import { useState } from "react";
import { useCart } from "../CartContext";
import Image from "next/image";


export default function ItemCart({ items }: { items: Item[] }){
    const { dispatch } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return (
    <div>
      {currentItems.map(item => (
        <div key={item.productId} className="border p-2">
            <Image src={item.imageUrl} alt={item.productName} width={100} height={100} />
          <p>{item.productName}</p>
          <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}>
            Add to Cart
          </button>
        </div>
      ))}
      {/* Pagination */}
      <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
      <button disabled={currentPage * itemsPerPage >= items.length} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
    </div>
  );
}