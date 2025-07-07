'use client';

import { Check, Loader } from "lucide-react";
import { createOrder } from "@/lib/actions/order.actions";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const PlaceOrderForm = () => {

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await createOrder();
        if(res.redirectTo) {
            router.push(res.redirectTo);
        }

    }

    const PlaceOrderButton = () => {
        const { pending } = useFormStatus();
        return <Button disabled={pending} className="w-full">
            {pending ? (
                <Loader className="w-4 h-4 animate-spin" />
            ) : (
                <Check className="w-4 h-4" />
            )} { ' ' } Passer la commande
        </Button>
    }

    return ( 
        <form onSubmit={handleSubmit} className="w-full">
            <PlaceOrderButton />
        </form>
    );
}
 
export default PlaceOrderForm;