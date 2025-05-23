import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
export default function ProductList() {
  const productName = "Product 1";
  return (
    <div>
      <h2 className="text-2xl">Product</h2>
      <Card>
      <CardHeader>
        <CardTitle>{productName}</CardTitle>
      </CardHeader>
      <div></div>
      </Card>
     <Button>Clear Cart</Button>
    </div>
  );
}
