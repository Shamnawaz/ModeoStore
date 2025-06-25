'use server';

import { CartItem } from "@/types";
import { convertToPlainObj, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)),
    shippingPrice = round2(itemsPrice > 100 ? 0  : 10),
    taxPrice = round2(0.20 * itemsPrice),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
    }
}


export async function addItemToCart(data: CartItem){

    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if(!sessionCartId) throw new Error('Cart Session not found');

        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;
        
        const cart = await getMyCart();

        const item = cartItemSchema.parse(data);

        const product = await prisma.product.findFirst({
            where: {
                id: item.productId
            }
        });

        if(!product) throw new Error('Product not found');

        if(!cart) {
            const newCart = insertCartSchema.parse({
                userId,
                items: [item],
                sessionCartId,
                ...calcPrice([item])
            });

            await prisma.cart.create({
                data: newCart
            });

            revalidatePath(`/product/${product.slug}`);

            return {
                success: true,
                message: `${product.name} a été ajouté au panier`,
            };
        } else {
            // Check if item is already in cart
            const existItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId);

            if(existItem) {
                // Check stock
                if(product.stock < existItem.quantity) throw new Error('Stock épuisé');

                // Increase the quantity of product
                (cart.items as CartItem[]).find((x) => x.productId === item.productId)!.quantity = existItem.quantity + 1
            } else {
                // If item does not exist in cart
                // Check stock
                if(product.stock < 1) throw new Error('Stock épuisé');

                // Add item to the cart.items
                cart.items.push(item);
            }

            await prisma.cart.update({
                where: {
                    id: cart.id,
                },
                data: {
                    items: cart.items as Prisma.CartUpdateitemsInput[],
                    ...calcPrice(cart.items as CartItem[])
                }
            });

            revalidatePath(`/product/${product.slug}`);

            return {
                success: true,
                message: `${product.name} ${existItem ? 'mis à jour dans le': 'ajouté au'} panier`
            };

        }

        // console.log({
        //     sessionCartId: sessionCartId,
        //     userID: userId,
        //     itemRequested: item,
        //     productFound: product
        // });
        
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