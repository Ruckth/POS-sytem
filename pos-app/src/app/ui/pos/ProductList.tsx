import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductListProps {
  totalItems: number;
  items: any[];
}

export default function ProductList({totalItems,items}: ProductListProps) {
  return (
    <div>
      <h2 className="text-2xl">Product {totalItems}</h2>
      <Card>
        
      </Card>
     <Button>Clear Cart</Button>
    </div>
  );
}
