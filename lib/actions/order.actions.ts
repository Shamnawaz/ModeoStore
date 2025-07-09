'use server';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObj, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";

export async function createOrder() {
    try {
        const session = await auth();
        if(!session) throw new Error('User is not authenticated');

        const cart = await getMyCart();
        
        const userId = session.user?.id;
        if(!userId) throw new Error('User not found');

        const user = await getUserById(userId);

        if(!cart || cart.items.length === 0) {
            return {
                success: false,
                message: 'Votre panier est vide',
                redirectTo: '/cart'
            };
        }
        if(!user.address) {
            return {
                success: false,
                message: 'Aucune adresse de livraison',
                redirectTo: '/shipping-address'
            };
        }
        if(!user.paymentMethod) {
            return {
                success: false,
                message: 'Aucun Moyen de paiement',
                redirectTo: '/payment-method'
            };
        }

        const order = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });

        // Create a transaction to create order and order items in DB
        const insertedOrderId = await prisma.$transaction(async (tx) => {
            // Create order
            const insertedOrder = await tx.order.create({ data: order });

            // Create order items from cart items
            for(const item of cart.items as CartItem[]) {
                await tx.orderItem.create({
                    data: {
                        ...item,
                        price: item.price,
                        orderId: insertedOrder.id
                    }
                });
            }
            // Clear cart
            await tx.cart.update({
                where: {id: cart.id},
                data: {
                    items: [],
                    totalPrice: 0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    itemsPrice: 0
                }
            });
            return insertedOrder.id;
        });

        if(!insertedOrderId) throw new Error('Order not created');

        return { success: true, message: 'Commande crée', redirectTo: `/order/${insertedOrderId}` };
        
    } catch (error) {
        if(isRedirectError(error)) throw error;
        return { 
            success: false,
            message: formatError(error)
        };
    }
}

export async function getOrderById(orderId: string) {
    const data = await prisma.order.findFirst({
        where: {
            id: orderId
        },
        include: {
            orderItems: true,
            user: { select: { name: true, email: true } }
        }
    });

    return convertToPlainObj(data);
}

export async function createPaypPalOrder(orderId: string) {
    try {

        const order = await prisma.order.findFirst({
            where: {
                id: orderId
            }
        });

        if(order) {
            const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

            await prisma.order.update({
                where: {
                    id: orderId
                },
                data: {
                    paymentResult: {
                        id: paypalOrder.id,
                        email_address: '',
                        status: '',
                        pricePaid: 0
                    }
                }
            });

            return {
                success: true,
                message: 'Commande crée avec succès',
                data: paypalOrder.id
            }
        } else {
            throw new Error('Order not found');
        }
        
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}