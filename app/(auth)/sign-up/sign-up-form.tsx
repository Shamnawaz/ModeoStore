'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/lib/actions/user.actions";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

const SignUpForm = () => {

    const [state, action] = useActionState(signUpUser, { success: false, message: '' });

    const searchParam = useSearchParams()
    const callbackUrl = searchParam.get('callbackUrl') || '/';

    const SignInButton = () => {
        const { pending } = useFormStatus();

        return (
            <Button className="w-full" variant={'default'} disabled={pending}>
                {pending ? 'Inscription...' : 'S\'Inscrire'}
            </Button>
        )
    }

    return ( 
        <form action={action}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className="spave-y-6 flex flex-col gap-5">
                <div>
                    <Label className="pb-2" htmlFor="name">Nom</Label>
                    <Input id="name" name="name" type="text" required autoComplete="name" defaultValue={signUpDefaultValues.name} />
                </div>

                <div>
                    <Label className="pb-2" htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required autoComplete="email" defaultValue={signUpDefaultValues.email} />
                </div>

                <div>
                    <Label className="pb-2" htmlFor="password">Mot de passe</Label>
                    <Input id="password" name="password" type="password" required autoComplete="password" defaultValue={signUpDefaultValues.password} />
                </div>

                <div>
                    <Label className="pb-2" htmlFor="confirmPassword">Confirmer le Mot de passe</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="confirmPassword" defaultValue={signUpDefaultValues.confirmPassword} />
                </div>

                <div>
                    <SignInButton />
                </div>

                { state && !state.success && (
                    <div className="text-center text-destructive">
                        { state.message }
                    </div>
                ) }

                <div className="text-sm text-center text-muted-foreground">
                    Vous avez déjà un compte ?{' '}
                    <Link href={'/sign-in'} target="_self" className="link">Se Connecter</Link>
                </div>
            </div>
        </form>
    );
}
 
export default SignUpForm;