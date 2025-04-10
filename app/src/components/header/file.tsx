import { useDispatch, useSelector } from 'react-redux'
import { SmallIcon } from '../../newComponents/Clickables/icons/file'
import './style.css'
import { RootState } from '../../helpers/store'
import { changeTheme } from '../../helpers/slice';
import { useEffect } from 'react';
export default function Header(){
    const theme=useSelector((state:RootState)=>state.context.theme);
    const dispatch=useDispatch();

    useEffect(() => {
        const themeType = theme ? 'dark' : 'light';
        console.log("Theme type : ",themeType);
        
        document.documentElement.setAttribute('data-theme', themeType);
      }, [theme]);


    const changeThemeColor=()=>{
        dispatch(changeTheme());
     
    }
    return(

        <div className='header'>
           <h2 className='appname'>{import.meta.env.VITE_APP_NAME}</h2>
           <SmallIcon onClick={changeThemeColor} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
</svg>
}/>
        </div>
    )
}