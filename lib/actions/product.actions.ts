'use server';

import { prisma } from "@/db/prisma";
import { LATEST_PRODUCT_LIMIT, PAGE_SIZE } from "../constants";
import { convertToPlainObj, formatError } from "../utils";
import { revalidatePath } from "next/cache";

// On récupère les produits récents
export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCT_LIMIT,
        orderBy: { createdAt: 'desc' }
    });

    return convertToPlainObj(data);
}

// On récupère un produit depuis le slug
export async function getProductBySlug(slug: string) {
    return await prisma.product.findFirst({
        where: {
            slug
        },
    });
}

export async function getAllProducts({ query, limit = PAGE_SIZE, page, category} : { query: string; limit?: number; page: number; category?: string; }) {
    const data = await prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit
    });

    const dataCount = await prisma.product.count();

    return {
        data,
        totalPages: Math.ceil(dataCount) / limit
    };
}

export async function deleteProduct(id: string) {
    try {
        const productExist = await prisma.product.findFirst({
            where: {
                id
            }
        });

        if(!productExist) throw new Error('Product not found');

        await prisma.product.delete({
            where: {
                id
            }
        });

        revalidatePath('/admin/products');

        return {
            success: true,
            message: 'Produit supprimé avec succès'
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}