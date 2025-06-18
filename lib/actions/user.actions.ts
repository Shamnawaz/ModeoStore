'use server';

import { signInFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// Connecte l'user avec email et mdp
export async function signInCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        });

        await signIn('credentials', user);

        return {
            success: true, message: 'Connecté avec succès'
        };
    } catch (error) {
        if(isRedirectError(error)) {
            throw error;
        }
    }

    return { success: false, message: 'Email ou mot de passe incorrecte' }
}

// Déconnecter l'user
export async function signOutUser() {
    await signOut();
}