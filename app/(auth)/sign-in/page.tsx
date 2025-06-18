import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignInForm from "./sign-in-form";

export const metadata: Metadata = {
    title: 'Login',
}

const SignInPage = () => {
    return ( 
        <div className="w-full max-w-md mx-auto">
            <Card className="py-10">
                <CardHeader className="space-y-4">
                    <Link href={'/'} className="flex-center">
                        <Image src={'/images/logo.svg'} width={100} height={100} alt={`${APP_NAME} logo`} priority={true}/>
                    </Link>
                    <CardTitle className="text-center">Se Connecter</CardTitle>
                    <CardDescription className="text-center">Connectez-vous à votre compte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <SignInForm />
                </CardContent>
            </Card>
        </div>
    );
}
 
export default SignInPage;