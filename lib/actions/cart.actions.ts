'use server';

import { CartItem } from "@/types";
import { convertToPlainObj, formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema } from "../validators";
import { cookies } from "next/headers";


// export async function addItemTocart(data: CartItem) {
//     try {
//         // Check for cart cookie
//         const sessionCartId = (await cookies()).get('sessionCartId')?.value;
//         // if(!sessionCartId) throw new Error('Cart Session not found');

//         // Get session and user ID
//         // const session = await auth();
//         // const userId = session?.user?.id ? (session.user.id as string) : undefined;

//         // Get Cart
//         // const cart = await getMyCart();

//         // Parse and validate item
//         const item = cartItemSchema.parse(data);
//         // TESTING
//         console.log({
//             'Session Cart ID': sessionCartId,
//             // 'User ID': userId,
//             // 'Item Requested': item
//         });
        
//         return {
//             success: true,
//             message: 'test',
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: formatError(error),
//         };
//     }
// }

export async function addItemToCart(data: CartItem){

    try {

        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if(!sessionCartId) throw new Error('Cart Session not found');

        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;
        
        const cart = await getMyCart();

        const item = cartItemSchema.parse(data);

        console.log({
            sessionCartId: sessionCartId,
            userID: userId,
            itemRequested: item
        });
        

        return {
            success: true,
            message: 'item added to cart'
        };
        
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }


}


export async function getMyCart() {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if(!sessionCartId) throw new Error('Cart Session not found');

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get user cart from database
    const cart = await prisma.cart.findFirst({
        where: userId ? { userId } : { sessionCartId }
    })

    if(!cart) return undefined;

    // Convert decimals and return
    return convertToPlainObj({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString()
    });
}