
import GenericLoader from "../../../components/GenericLoader/file";
import PostComponent from "../../../components/postComponent/file";
import { Holder } from "../../../newComponents/Generics/GenericHolders/file";
import './style.css'
export default function Home(){
    return(

        <Holder classname="home-page">
            <GenericLoader url="/content?type=feed&" Element={PostComponent}/>
        </Holder>
        
    )
}