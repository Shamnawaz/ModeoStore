import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
        .string()
        .refine((value) => /^\d+(\.\d{2})?€/.test(formatNumberWithDecimal(Number(value))), 'Le prix doit obligatoirement avoir deux décimales après la virgule' )

// Schéma d'insertions des produits
export const insertProductSchema = z.object({
    name: z.string().min(3, 'Le nom du produit doit contenir au moins 3 caractères.'),
    slug: z.string().min(3, 'Le slug du produit doit contenir au moins 3 caractères.'),
    category: z.string().min(3, 'La categorie du produit doit contenir au moins 3 caractères.'),
    brand: z.string().min(3, 'La marque du produit doit contenir au moins 3 caractères.'),
    description: z.string().min(3, 'La description du produit doit contenir au moins 3 caractères.'),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, 'Le produit doit avoir au moins une image'),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency,
});