import Image from 'next/image';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Item } from '@/app/types';

interface ItemCardProps {
  item: Item;
  isAvailable: (item: Item) => boolean;
  getItemQuantity: (productId: string) => number;
  handleAddItem: (item: Item) => void;
  increaseCartQuantity: (productId: string) => void;
  decreaseCartQuantity: (productId: string) => void;
}

export default function ItemCard({
  item,
  isAvailable,
  getItemQuantity,
  handleAddItem,
  increaseCartQuantity,
  decreaseCartQuantity,
}: ItemCardProps) {
  const quantity = getItemQuantity(item.productId);
  const available = !isAvailable(item);

  return (
    <div className="border-r-2 p-4 rounded-sm shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <div className="relative">
        <Image
          src={item.imageUrl}
          alt={item.productName}
          width={200}
          height={200}
          className="object-cover w-full h-48 mb-4 rounded-md"
        />
        <div className="absolute bottom-6 right-2 flex text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {item.category}
        </div>
        <div className="absolute top-2 right-2 flex text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
          Stock: {item.stock.toLocaleString('en-US')}
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="lg:text-base 2xl:text-lg xl:font-semibold mb-auto">{item.productName}</h3>
        <p className="text-gray-600 text-sm mb-1">{item.productId}</p>
        <p className="text-gray-700 font-semibold mb-4">
          Price: ฿{item.price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>

      {available ? (
        <div className="flex mt-auto  items-center justify-between">
          {quantity === 0 ? (
            <button
              onClick={() => handleAddItem(item)}
              className="flex items-center gap-2 bg-blue-100 text-blue px-4 py-2 rounded-md hover:bg-blue-800 hover:text-white transition duration-200 font-medium"
            >  
                <ShoppingCart size={12} />
                <span className="text-xs font-medium">In Cart</span>
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseCartQuantity(item.productId)}
                  className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                  title="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="text-md font-semibold text-gray-800 min-w-[2rem] text-center">
                  {quantity.toLocaleString('en-US')}
                </span>
                <button
                  onClick={() => increaseCartQuantity(item.productId)}
                  className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                  title="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-red-500 font-medium">Out of Stock</p>
        </div>
      )}
    </div>
  );
};