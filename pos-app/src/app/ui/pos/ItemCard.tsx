import Image from 'next/image';
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
    <div className="border p-4 rounded-lg shadow-md">
      <Image
        src={item.imageUrl}
        alt={item.productName}
        width={200}
        height={200}
        className="object-cover w-full h-48 mb-4 rounded-md"
      />
      <h3 className="text-lg font-semibold mb-2">{item.productName}</h3>
      <p className="text-gray-700 mb-2">{item.productId}</p>
      <p className="text-gray-700 mb-2">Price: {item.price} baht</p>
      <p className="text-gray-700 mb-4">Stock: {item.stock}</p>

      {available ? (
        <div className="flex items-center justify-between">
          {quantity === 0 ? (
            <button
              onClick={() => handleAddItem(item)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => decreaseCartQuantity(item.productId)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
              >
                -
              </button>
              <span className="text-lg font-bold">{quantity}</span>
              <button
                onClick={() => increaseCartQuantity(item.productId)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-200"
              >
                +
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-red-500">Out of Stock</p>
        </div>
      )}
    </div>
  );
};

