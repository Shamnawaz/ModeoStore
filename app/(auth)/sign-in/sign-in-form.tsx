'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInCredentials } from "@/lib/actions/user.actions";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

const SignInForm = () => {

    const [state, action] = useActionState(signInCredentials, { success: false, message: '' });

    const searchParam = useSearchParams()
    const callbackUrl = searchParam.get('callbackUrl') || '/';

    const SignInButton = () => {
        const { pending } = useFormStatus();

        return (
            <Button className="w-full" variant={'default'} disabled={pending}>
                {pending ? 'Connexion...' : 'Se Connecter'}
            </Button>
        )
    }

    return ( 
        <form action={action}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className="spave-y-6 flex flex-col gap-5">
                <div>
                    <Label className="pb-2" htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required autoComplete="email" defaultValue={signInDefaultValues.email} />
                </div>

                <div>
                    <Label className="pb-2" htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required autoComplete="password" defaultValue={signInDefaultValues.password} />
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
                    Vous n&apos;avez pas de compte ?{' '}
                    <Link href={'/sign-up'} target="_self" className="link">S&apos;Inscrire</Link>
                </div>
            </div>
        </form>
    );
}
 
export default SignInForm;