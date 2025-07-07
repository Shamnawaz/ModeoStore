import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
// import { ShippingAddress } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Détails de la commande'
}

const OrderDetailsPage = async (props: { params: Promise<{id: string}> }) => {

    const { id } = await props.params;

    const order = await getOrderById(id);
    if(!order) notFound();

    return ( 
        <>Details {order.totalPrice}</>
    );
}
 
export default OrderDetailsPage;