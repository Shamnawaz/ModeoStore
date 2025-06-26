import { Metadata } from "next";
import CartTable from "./cart-table";

import { getMyCart } from "@/lib/actions/cart.actions";

export const metadata: Metadata = {
    title: 'Panier',
};

const CartPage = async () => {

    const cart = await getMyCart();

    return ( 
        <>
            <CartTable cart={cart} />
        </>
    );
}
 
export default CartPage;