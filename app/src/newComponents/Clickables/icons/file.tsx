import React, { CSSProperties } from 'react';
import './style.css';

type IconsProps = {
  icon?: React.ReactNode;
  imgPath?:string;
  onClick?:()=>void;
  style?:CSSProperties;
};

export const SmallIcon: React.FC<IconsProps> = ({ icon ,onClick}) => {
  return (
    <div onClick={onClick} className="small-icon">
      {icon}
    </div>
  );
};

export const MediumIcon: React.FC<IconsProps> = ({ icon,onClick }) => {
    return (
      <div onClick={onClick} className="medium-icon">
        {icon}
      </div>
    );
  };
  

export const SmallImage: React.FC<IconsProps> = ({onClick,style ,imgPath}) => {
    return (
      <div  onClick={onClick} >
        <img style={style} src={imgPath?imgPath:"/icons/profile-default.svg"} className="image dp-small"/>
      </div>
    );
  };
  
  export const MediumImage: React.FC<IconsProps> = ({ imgPath,onClick }) => {
    return (
      <div onClick={onClick} >
        <img src={imgPath?imgPath:"/icons/profile-default.svg"} className="dp-large" />
      </div>
    );
  };
  