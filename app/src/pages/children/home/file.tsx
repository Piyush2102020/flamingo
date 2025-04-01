
import GenericLoader from "../../../components/GenericLoader/file";
import PostComponent from "../../../components/postComponent/file";
import './style.css'
export default function Home(){
    return(
        <div className="home-page">
          
            <GenericLoader url="/content?type=feed&" Element={PostComponent}/>
        </div>
        
    )
}