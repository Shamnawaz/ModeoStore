'use client';

import { Cart } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const CartTable = ({ cart }: { cart?: Cart }) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return ( 
        <>
            <h1 className="py-4 h2-bold">
                Votre Panier
            </h1>
            { !cart || cart.items.length === 0 ? (
                <div>
                    Le panier est vide. <Link href={'/'}>Acheter des vêtements</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produits</TableHead>
                                    <TableHead className="text-center">Quantité</TableHead>
                                    <TableHead className="text-right">Prix</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                { cart.items.map((item) => (
                                    <TableRow key={item.slug}>
                                        <TableCell>
                                            <Link className="flex items-center" href={`/product/${item.slug}`}>
                                                <Image src={item.image} alt={item.name} width={50} height={50} priority={true} />
                                                <span className="px-4">{item.name}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="flex-center gap-2 py-4">
                                            <Button disabled={isPending} variant={'outline'} type="button" onClick={() => startTransition(async () => {
                                                const res = await removeItemFromCart(item.productId);
                                                if(!res.success) {
                                                    toast.error(res.message);
                                                }
                                            })}>
                                                { isPending ? (
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Minus className="w-4 h-4" />
                                                )}
                                            </Button>
                                            <span>{item.quantity}</span>
                                            <Button disabled={isPending} variant={'outline'} type="button" onClick={() => startTransition(async () => {
                                                const res = await addItemToCart(item);
                                                if(!res.success) {
                                                    toast.error(res.message);
                                                }
                                            })}>
                                                { isPending ? (
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Plus className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                                {item.price}€
                                        </TableCell>
                                    </TableRow>
                                ) ) }
                            </TableBody>
                        </Table>
                    </div>

                    <Card>
                        <CardContent className="p-4 gap-4">
                                <div className="pb-3 text-xl">
                                    Sous-total ({ cart.items.reduce((a,c) => a + c.quantity, 0 ) }) :
                                    <span className="font-bold pl-3">{ formatCurrency(cart.itemsPrice) }</span>
                                </div>
                                <Button className="w-full" disabled={isPending} onClick={() => startTransition(() => router.push('/shipping-address'))}>
                                    { isPending ? (
                                        <Loader className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <ArrowRight className="w-4 h-4" /> 
                                    )  } Procéder au paiement
                                </Button>
                        </CardContent>
                    </Card>
                </div>
            ) }
        </>
    );
}
 
export default CartTable;