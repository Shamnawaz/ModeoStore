'use client';

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { 
    AlertDialog, 
    AlertDialogContent, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "../ui/alert-dialog";
import { AlertDialogCancel, AlertDialogDescription } from "@radix-ui/react-alert-dialog";

const DeleteDialog = ({ id, action }: { id: string, action: (id: string) => Promise<{success: boolean, message: string}> }) => {

    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    
    const handleDeleteClick = () => {
        startTransition(async () => {
            const res = await action(id);

            if(!res.success) {
                toast.error(res.message);
            } else {
                setOpen(false);
                toast.success(res.message);
            }
        })
    }

    return ( 
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button size={'sm'} variant={'destructive'} className="ml-2 cursor-pointer">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Êtes-vous sur ? 
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                        Retour
                    </AlertDialogCancel>
                    <Button className="cursor-pointer" variant={'destructive'} size={'sm'} disabled={isPending} onClick={handleDeleteClick}>
                        { isPending ? 'Suppression...' : 'Delete' }
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
 
export default DeleteDialog;