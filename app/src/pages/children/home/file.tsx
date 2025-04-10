
import PostComponent from "../../../components/postComponent/file";
import { Holder } from "../../../newComponents/Generics/GenericHolders/file";
import { GenericLazyLoader } from "../../../newComponents/Generics/GenericLazyLoader/file";
import './style.css'
export default function Home(){
    return(

        <Holder classname="home-page">
            <GenericLazyLoader url="/content?type=feed&" Element={PostComponent}/>
        </Holder>
        
    )
}