import { getLatestProducts } from "@/lib/actions/product.actions";
import ProductList from "@/components/shared/product/product-list";

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); 

const HomePage = async () => {
  // await delay(2000););

  const latestProducts = await getLatestProducts();
  
  return (
    <>
      <ProductList data={latestProducts} title="Nouveautés Récentes" limit={4} />
    </> 
  );
}
 
export default HomePage;