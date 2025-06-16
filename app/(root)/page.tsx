import sampleData from "@/db/sample-data";
import ProductList from "@/components/shared/product/product-list";
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); 

const HomePage = () => {
  // await delay(2000););
  
  return (
    <>
      <ProductList data={sampleData.products} title="Nouveautés Récentes" limit={4} />
    </> 
  );
}
 
export default HomePage;