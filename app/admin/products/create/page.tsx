import { Metadata } from "next";
import ProductForm from "@/components/admin/product-form";


export const metadata: Metadata = {
    title: 'Ajouter un produit'
}

const CreateProductPage = () => {
    return ( 
        <>
            <h2 className="h2-bold">Ajouter un produit</h2>
            <div className="my-8">
                <ProductForm type='Create' />
            </div>
        </>
    );
}
 
export default CreateProductPage;