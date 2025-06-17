'use server';

import { LATEST_PRODUCT_LIMIT } from "../constants";
import { PrismaClient } from "../generated/prisma";
import { convertToPlainObj } from "../utils";

// On récupère les produits récents
export async function getLatestProducts() {
    const prisma = new PrismaClient();

    const data = await prisma.product.findMany({
        take: LATEST_PRODUCT_LIMIT,
        orderBy: { createdAt: 'desc' }
    });

    return convertToPlainObj(data);
}