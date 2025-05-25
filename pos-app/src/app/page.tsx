
import Pos from "@/app/ui/Pos";
import { getAllItems } from "@/lib/data";


export default async function Home() {
 
  const allItems = await getAllItems();

    return (
        <Pos items={allItems}/>
    );
}
