
import PostComponent from "../../../components/postComponent/file";
import { ServerRoutes } from "../../../helpers/serverRoutes";
import { Holder } from "../../../newComponents/Generics/GenericHolders/file";
import { GenericLazyLoader } from "../../../newComponents/Generics/GenericLazyLoader/file";
export default function Home(){
    return(

        <Holder classname="home-page">
            <GenericLazyLoader url={ServerRoutes.postRoutes.content('','?type=feed&')} Element={PostComponent}/>
        </Holder>
        
    )
}