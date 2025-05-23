import { Item, mockItems } from "@/lib/placeholder";
export type { Item };

const ITEMS_PER_PAGE = 6;

// Get all items
export async function getAllItems() {
    return mockItems;
  }

// Get item by id
export async function getItems(ids: string[]) {
  // await new Promise(resolve => setTimeout(resolve, 1000));
  return mockItems.filter(item => ids.includes(item.productId));
}
// Get items by page
export async function fetchFilteredItems(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Filter items based on search query
  const filteredItems = mockItems.filter(item => 
    item.productName.toLowerCase().includes(query.toLowerCase()) ||
    item.productId.toLowerCase().includes(query.toLowerCase())
  );

  return filteredItems.slice(offset, offset + ITEMS_PER_PAGE);
}

// Get total pages
export async function fetchPosPages(query: string) {
  const data = getAllItems();
  const filteredItems = (await data).filter(item =>
    item.productName.toLowerCase().includes(query.toLowerCase()) ||
    item.productId.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  return totalPages;
}

// Get total items
export async function fetchPosTotal(query: string) {
  const data = getAllItems();
  const filteredItems = (await data).filter(item =>
    item.productName.toLowerCase().includes(query.toLowerCase()) ||
    item.productId.toLowerCase().includes(query.toLowerCase())
  );
  return filteredItems.length;
}