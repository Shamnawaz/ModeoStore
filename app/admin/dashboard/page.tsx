import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import { BadgeEuroIcon, Barcode, CreditCard, Users } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Admin Dashboard'
};

const AdminDashboardPage = async () => {

    const session = await auth();

    if(session?.user.role !== 'ADMIN') throw new Error('User is not authorized');

    const summaryData = await getOrderSummary();
    

    return ( 
        <div className="space-y-2">
            <h1 className="h2-bold">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="py-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
                        <BadgeEuroIcon />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(summaryData.totalSales._sum.totalPrice?.toString() || 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card className="py-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ventes</CardTitle>
                        <CreditCard />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(summaryData.ordersCount)}
                        </div>
                    </CardContent>
                </Card>
                <Card className="py-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clients</CardTitle>
                        <Users />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(summaryData.usersCount)}
                        </div>
                    </CardContent>
                </Card>
                            <Card className="py-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Produits</CardTitle>
                        <Barcode />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(summaryData.productsCount)}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 py-4">
                    <CardHeader>
                        <CardTitle>Apperçu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* TODO - CHART */}
                    </CardContent>
                </Card>
                <Card className="col-span-3 py-4">
                    <CardHeader>
                        <CardTitle>Ventes Récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>CLIENT</TableHead>
                                    <TableHead>DATE</TableHead>
                                    <TableHead>TOTAL</TableHead>
                                    <TableHead>ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summaryData.latestSales.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{ order?.user?.name ? order.user.name : 'Deleted User' }</TableCell>
                                        <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                                        <TableCell>{ formatCurrency(order.totalPrice) }</TableCell>
                                        <TableCell>
                                            <Link href={`/order/${order.id}`}>
                                                <span className="px-2">Détails</span>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>    
    );
}
 
export default AdminDashboardPage;