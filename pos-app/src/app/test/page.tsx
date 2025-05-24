import Test from '@/app/ui/Test' ;
import { getAllItems } from "@/lib/data";


export default async function Page() {

    const allItems = await getAllItems();

    return (
        <Test
            items={allItems}
        />
    );
}