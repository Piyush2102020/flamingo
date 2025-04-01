import './style.css'
export default function Header(){
    return(

        <div className='header'>
           <h2 className='appname'>{import.meta.env.VITE_APP_NAME}</h2>
        </div>
    )
}