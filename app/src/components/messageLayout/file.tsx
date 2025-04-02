import { useSelector } from "react-redux"
import { RootState } from "../../helpers/store"
import './style.css'
export default function MessageLayout({item}:any){
    const userId=useSelector((state:RootState)=>state.context.userData._id);
    return(
        <div className={`base ${userId==item.receiverId?"receiver":"sender"}`}>
            <p>{item.text}</p>
        </div>
    )
}