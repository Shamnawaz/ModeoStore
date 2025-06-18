'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";

const SignInForm = () => {
    return ( 
        <form>
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
                    <Button className="w-full" value={'default'}>Se Connecter</Button>
                </div>
                <div className="text-sm text-center text-muted-foreground">
                    Vous n&apos;avez pas de compte ?{' '}
                    <Link href={'/sign-up'} target="_self" className="link">S&apos;inscrire</Link>
                </div>
            </div>
        </form>
    );
}
 
export default SignInForm;