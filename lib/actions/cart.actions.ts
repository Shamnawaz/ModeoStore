'use server';

import { CartItem } from "@/types";

export async function addItemTocart(data: CartItem) {
    return {
        success: false,
        message: 'error',
    };
}