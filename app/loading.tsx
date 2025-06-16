import Image from "next/image";
import spinner from '@/assets/loader.gif'

const LoadingPage = () => {
    return ( 
        <div className="flex-center h-screen w-screen">
            <Image src={spinner} height={150} width={150} alt="Loader" />
        </div> 
    );
}
 
export default LoadingPage;