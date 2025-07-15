import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

const metadata: Metadata = {
    title: 'Unauthorized Access'
}

const UnauthorizedPage = () => {
    return ( 
        <div className="container mx-auto flex flex-col items-center justify-center space-y-4 h-[calc(100vh-200px)]">
            <h1 className="h1-bold text-4xl">Accès Interdit</h1>
            <p className="text-muted-foreground">
                Vous n&apos;avez pas la permission d&apos;accéder à cette page.
            </p>
            <Button asChild>
                <Link href={'/'}>Accueil</Link>
            </Button>
        </div>
    );
}
 
export default UnauthorizedPage;