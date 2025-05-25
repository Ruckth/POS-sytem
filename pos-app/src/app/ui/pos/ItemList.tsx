'use client'

import { Item } from "@/app/types";
import { useState, useCallback, Dispatch } from "react"; // No need for useMemo anymore
import { useCart } from "../CartContext";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent
} from "@/components/ui/alert-dialog";
import Search from "./Search";
import Pagination from "./Pagination";
import ItemCard from "./ItemCard";
import { Button } from "@/components/ui/button";



export default function ItemCart({ items }: { items: Item[] }) {
  const { state, dispatch } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  // check if item is over stock and show alert dialog
  const [itemOverStock, setItemOverStock] = useState(false);
  //check before remove item from cart
  const [isRemoveItemAlertOpen, setIsRemoveItemAlertOpen] = useState(false);
  // Add a state to track the item to remove
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);



  const itemsPerPage = 6;

  // DIRECTLY CALCULATE filteredItems on each render
  const filteredItems = searchTerm
    ? items.filter(item =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : items;

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handleAddItem = (item: Item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }


  const increaseCartQuantity = (productId: string) => {
    const currentItemInCart = state.itemsInCart.find(i => i.item.productId === productId);
    if (currentItemInCart) {
      const newQuantity = currentItemInCart.cartQuantity + 1;

      if (newQuantity <= currentItemInCart.item.stock) {
        dispatch({
          type: 'SET_QUANTITY',
          payload: {
            productId: productId,
            quantity: newQuantity
          }
        });
      } else {
        setItemOverStock(true);
      }
    }
  };


  const decreaseCartQuantity = (productId: string) => {
    const currentItemInCart = state.itemsInCart.find(i => i.item.productId === productId);
    if (currentItemInCart && currentItemInCart.cartQuantity > 1) {
      dispatch({
        type: 'SET_QUANTITY',
        payload: {
          productId,
          quantity: currentItemInCart.cartQuantity - 1
        }
      });
    } else if (currentItemInCart && currentItemInCart.cartQuantity === 1) {
      setItemToRemove(productId);
      setIsRemoveItemAlertOpen(true);
    }
  };


  const getItemQuantity = (productId: string) => {
    const itemInCart = state.itemsInCart.find(i => i.item.productId === productId);
    return itemInCart ? itemInCart.cartQuantity : 0;
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  // A function that is passed data to search and change page
  // useCallback to prevents unnecessary re-execution of the search effect
  // if not use 'useCallback' this function will be re-executed on every render 
  // Example if not use 'useCallback': when change page this function will be re-executed and change page back to first page
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  }, []);
  // Function to check if an item is available (stock > 0)
  const isAvailable = (item: Item) => {
    return item.stock <= 0;
  };

  return (
    <div className="container mx-auto p-4 ">
      <div className="flex-shrink-0 p-4 bg-white border-b sticky top-0 z-10">
        <Search onSearch={handleSearch} />
      </div>
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 ">
          {currentItems.length > 0 ? (
            currentItems.map(item => (
              <ItemCard
                key={item.productId}
                item={item}
                isAvailable={isAvailable}
                getItemQuantity={getItemQuantity}
                handleAddItem={handleAddItem}
                increaseCartQuantity={increaseCartQuantity}
                decreaseCartQuantity={decreaseCartQuantity}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">No items found.</p>
          )}
          {/* AlertDialog is now controlled by isOverStockAlertOpen state */}
          <OverStockDialog itemOverStock={itemOverStock} setItemOverStock={setItemOverStock} />
          {/* AlertDialog before remove  */}
          <ConfirmDeleteDialog
            isRemoveItemAlertOpen={isRemoveItemAlertOpen}
            setIsRemoveItemAlertOpen={setIsRemoveItemAlertOpen}
            itemToRemove={itemToRemove}
            dispatch={dispatch}
            setItemToRemove={setItemToRemove}
          />
      </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
    </div>
  );
}

export function OverStockDialog({ itemOverStock, setItemOverStock }: { itemOverStock: boolean, setItemOverStock: (value: boolean) => void }) {
  return (
    <>
      {/* AlertDialog is now controlled by isOverStockAlertOpen state */}
      <AlertDialog open={itemOverStock} onOpenChange={setItemOverStock}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">Item Over Stock</AlertDialogTitle>
          </AlertDialogHeader>
          <p>You cannot add more of this item than what is available in stock.</p>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )

}
interface RemoveItemAlertDialogProps {
  isRemoveItemAlertOpen: boolean;
  setIsRemoveItemAlertOpen: (open: boolean) => void;
  itemToRemove: any;
  dispatch: Dispatch<any>;
  setItemToRemove: (item: any | null) => void;
}

export function ConfirmDeleteDialog({
  isRemoveItemAlertOpen,
  setIsRemoveItemAlertOpen,
  itemToRemove,
  dispatch,
  setItemToRemove,
}: RemoveItemAlertDialogProps) {
  return (
    <AlertDialog open={isRemoveItemAlertOpen} onOpenChange={setIsRemoveItemAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Item</AlertDialogTitle>
        </AlertDialogHeader>
        <p>Are you sure you want to remove this item from your cart?</p>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            setIsRemoveItemAlertOpen(false);
            setItemToRemove(null);
          }}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => {
              if (itemToRemove) {
                dispatch({ type: 'REMOVE_ITEM', payload: itemToRemove });
              }
              setIsRemoveItemAlertOpen(false);
              setItemToRemove(null);
            }}
          >
            Remove
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}