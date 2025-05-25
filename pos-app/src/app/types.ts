// item.ts
export interface Item {
    no: number;
    productId: string;
    productName: string;
    imageUrl: string;
    category: string;
    price: number;
    stock: number;
  }
  
  // itemInCart.ts
  export interface ItemInCart {
    item: Item;
    discountType?: 'percentage' | 'amount';
    discount?: number | '';
    delivery?: boolean;
    cartQuantity: number;
  }
  