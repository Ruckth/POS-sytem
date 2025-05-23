import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CartList() {
    return (
        <div>
            <h2>Cart</h2>
            <div className="flex flex-wrap items-center space-x-1">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {}}
                >
                    -
                </Button>
                <Input 
                    type="number" 
                    className="w-20 text-center border-0" 
                    value="1" 
                    onChange={(e) => {}}
                />
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {}}
                >
                    +
                </Button>
            </div>
        </div>
    )
}