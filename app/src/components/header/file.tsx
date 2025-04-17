import { useDispatch, useSelector } from 'react-redux'
import { MediumImage, SmallIcon, SmallImage } from '../../newComponents/Clickables/icons/file'
import { RootState } from '../../helpers/store'
import { changeTheme } from '../../helpers/slice';
import { useEffect } from 'react';
import { Holder } from '../../newComponents/Generics/GenericHolders/file';
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
          <Holder style={{alignItems:"center"}} direction='horizontal'>
            <MediumImage style={{width:"var(--icon-extra-large)",height:"var(--icon-extra-large)"}} imgPath='/icons/logo.png'/>
          <h2 className='appname'>{import.meta.env.VITE_APP_NAME}</h2>
          </Holder>
           
           <Holder style={{gap:"var(--gap-medium)",width:"fit-content",display:"flex"}} direction='horizontal'>
           
           {/* <SmallIcon  icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
          </svg>
           }/> */}
           <SmallIcon onClick={changeThemeColor} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
</svg>
}/>
           </Holder>
           
         
        </div>
    )
}