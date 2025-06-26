'use client';

import { ShippingAddress } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { shippingAddressSchema } from "@/lib/validators";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const onSubmit = (values) => {
        console.log(values);
        
        return;
    }

    const form = useForm<z.infer<typeof shippingAddressSchema>>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || shippingAddressDefaultValues,
    });

    return ( 
        <>
            <div className="max-w-md mx-auto space-y-4">
                <h1 className="h2-bold mt-4 text-center">Adresse de livraison</h1>
                <p className="text-sm text-muted-foreground text-center">
                    Saisissez une adresse de livraison
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} method="post" className="space-y-4">
                        <div className="flex flex-col gap-4 md:flex-row">
                            <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'fullName'> }) => (
                                <FormItem className="w-full">
                                <FormLabel>Nom et Prénom</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <FormField
                            control={form.control}
                            name="streetAddress"
                            render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'streetAddress'> }) => (
                                <FormItem className="w-full">
                                <FormLabel>Adresse postale</FormLabel>
                                <FormControl>
                                    <Input placeholder="123 main st..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <FormField
                            control={form.control}
                            name="city"
                            render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'city'> }) => (
                                <FormItem className="w-full">
                                <FormLabel>Ville</FormLabel>
                                <FormControl>
                                    <Input placeholder="Paris..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'postalCode'> }) => (
                                <FormItem className="w-full">
                                <FormLabel>Code Postal</FormLabel>
                                <FormControl>
                                    <Input placeholder="75000..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <FormField
                            control={form.control}
                            name="country"
                            render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'country'> }) => (
                                <FormItem className="w-full">
                                <FormLabel>Pays</FormLabel>
                                <FormControl>
                                    <Input placeholder="France..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button className="w-full" type="submit" disabled={isPending}>
                                { isPending ? (
                                    <Loader className="h-4 w-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="h-4 w-4" />
                                ) } Continuer
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    );
}
 
export default ShippingAddressForm;