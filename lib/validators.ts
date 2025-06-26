import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
        .string()
        .refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))), 'Le prix doit obligatoirement avoir deux décimales après la virgule' );

// Schéma du cart
export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Le produit est requis'),
    name: z.string().min(1, 'Le nom du produit est requis'),
    slug: z.string().min(1, 'Le slug du produit est requis'),
    quantity: z.number().int().nonnegative('La quantité du produit doit être obligatoirement un nombre positif'),
    image: z.string().min(1, 'Image du produit est requis'),
    price: currency
});

export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'La session du panier est requis'),
    userId: z.string().optional().nullable()
});

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

// Schéma pour connecter un user
export const signInFormSchema = z.object({
    email: z.string().email('Adresse email invalide'),
    password: z.string().min(8, 'Le mot de passe doit comporter au moins 8 caractères')
});

// Schéma pour inscrire un user
export const signUpFormSchema = z.object({
    name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
    email: z.string().email('Adresse email invalide'),
    password: z.string().min(8, 'Le mot de passe doit comporter au moins 8 caractères'),
    confirmPassword: z.string().min(8, 'La confirmation du mot de passe doit comporter au moins 8 caractères'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passes ne sont pas identiques",
    path: ['confirmPassword'],
} );

// Schema for shipping address
export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'Le nom doit obligatoirement contenir au moins 3 caractères'),
    streetAddress: z.string().min(8, 'Addresse doit obligatoirement contenir au moins 3 caractères'),
    city: z.string().min(3, 'La ville doit obligatoirement contenir au moins 3 caractères'),
    postalCode: z.string().min(3, 'Le code postal doit obligatoirement contenir au moins 3 caractères'),
    country: z.string().min(3, 'Le pays doit obligatoirement contenir au moins 3 caractères'),
    lat: z.number().optional(),
    lng: z.number().optional(),
})
