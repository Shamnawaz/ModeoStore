'use server';

import { prisma } from "@/db/prisma";
import { LATEST_PRODUCT_LIMIT } from "../constants";
import { convertToPlainObj } from "../utils";

// On récupère les produits récents
export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCT_LIMIT,
        orderBy: { createdAt: 'desc' }
    });

    return convertToPlainObj(data);
}