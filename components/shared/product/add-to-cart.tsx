'use client';

import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner";

const AddToCart = ({ item }: { item: CartItem }) => {

    const router = useRouter();

    const handleAddToCart = async () => {
        const res = await addItemToCart(item);

        if(!res.success) {
            toast.error(res.message);
            return;
        }

        toast.success(`${item.name} a été ajouté au panier`, {
            action: {
                label: 'Panier',
                onClick: () => router.push('/cart'),
            }
        });
        
    }

    return ( 
        <Button className="w-full" type="button" onClick={handleAddToCart}> <Plus /> Ajouter Au Panier</Button>
    );
}
 
export default AddToCart;