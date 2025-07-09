'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { 
    PayPalButtons, 
    PayPalScriptProvider, 
    usePayPalScriptReducer 
} from '@paypal/react-paypal-js';
import { createPaypPalOrder, approvePayPalOrder } from "@/lib/actions/order.actions";
import { toast } from "sonner";

const OrderDetailsTable = ({ order, paypalClientId }: { order: Order, paypalClientId: string }) => {

    const {
        id,
        shippingAddress,
        orderItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        isPaid,
        isDelivered,
        paidAt,
        deliveredAt
    } = order;

    const PrintLoadingState = () => {
        const [{ isPending, isRejected }] = usePayPalScriptReducer()
        let status = '';

        if(isPending) {
            status = 'Loading PayPal...';
        } else if(isRejected) {
            status = 'Error Loading PayPal';
        }

        return status;
    }

    const handleCreatePayPalOrder = async () => {
        const res = await createPaypPalOrder(id);
        if(!res.success) {
            toast.error(res.message);
        }

        return res.data;
    }

    const handleApprovePayPalOrder = async (data: {orderID: string}) => {
        const res = await approvePayPalOrder(id, data);
        if(!res.success) {
            toast.error(res.message);
        }
        toast.success(res.message);
    }

    return ( 
        <>
            <h1 className="py-4 text-2xl">Commande { formatId(id) }</h1>
            <div className="grid md:grid-cols-3 md:gap-5">
                <div className="col-span-2 space-y-4 overflow-x-auto">
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Méthode de paiement</h2>
                            <p className="mb-2">{paymentMethod}</p>
                            {isPaid ? (
                                <Badge variant={'secondary'}>
                                    Payé le { formatDateTime(paidAt!).dateTime }
                                </Badge>
                            ) : (
                                <Badge variant={'destructive'}>
                                    Impayé
                                </Badge>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Adresse de livraison</h2>
                            <p>{shippingAddress.fullName}</p>
                            <p className="mb-2">
                                {shippingAddress.streetAddress}, {shippingAddress.city} { ' ' }
                                {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                            {isDelivered ? (
                                <Badge variant={'secondary'}>
                                    Livré le { formatDateTime(deliveredAt!).dateTime }
                                </Badge>
                            ) : (
                                <Badge variant={'destructive'}>
                                    non livré
                                </Badge>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Articles de la commande</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Articles</TableHead>
                                        <TableHead>Quantité</TableHead>
                                        <TableHead>Prix</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderItems.map((item) => (
                                        <TableRow key={item.slug}>
                                            <TableCell>
                                                <Link className="flex items-center" href={`/product/${item.slug}`}>
                                                    <Image src={item.image} alt={item.name} width={50} height={50} />
                                                    <span className="px-4">{item.name}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-2">{item.quantity}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-2">{item.price}€</span>
                                            </TableCell>
                                        </TableRow>
                                    ) )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card className="md:hidden">
                        <CardContent className="p-4 gap-4 space-y-4">
                            <div className="flex justify-between">
                                <div>Articles</div>
                                <div>{ formatCurrency(itemsPrice) }</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Taxes</div>
                                <div>{ formatCurrency(taxPrice) }</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Livraison</div>
                                <div>{ formatCurrency(shippingPrice) }</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Total</div>
                                <div>{ formatCurrency(totalPrice) }</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card className="hidden md:block">
                        <CardContent className="p-4 gap-4 space-y-4">
                            <div className="flex justify-between">
                                <div>Articles</div>
                                <div>{ formatCurrency(itemsPrice) }</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Taxes</div>
                                <div>{ formatCurrency(taxPrice) }</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Livraison</div>
                                <div>{ formatCurrency(shippingPrice) }</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Total</div>
                                <div>{ formatCurrency(totalPrice) }</div>
                            </div>
                            {/* Paypal Payment */}
                            { !isPaid && paymentMethod === 'PayPal' && (
                                <div>
                                    <PayPalScriptProvider options={{clientId: paypalClientId, currency: 'EUR'}}>
                                        <PrintLoadingState />
                                        <PayPalButtons createOrder={handleCreatePayPalOrder} onApprove={handleApprovePayPalOrder} />
                                    </PayPalScriptProvider>
                                </div>
                            ) }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
 
export default OrderDetailsTable;