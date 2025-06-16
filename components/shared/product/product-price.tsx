import { cn } from "@/lib/utils";

const ProductPrice = ({ value, className }: { value: number; className?: string }) => {
    
    // Permet d'assurer d'avoir deux décimales après la virgule
    const stringValue = value.toFixed(2);

    // Récupérer l'int ou le float
    const [intValue, floatValue] = stringValue.split('.');
    return ( 
        <p className={ cn('text-2xl', className) }>
            {intValue}
            <span className="text-xs align-super">{floatValue}€</span>
        </p>
    );
}
 
export default ProductPrice;