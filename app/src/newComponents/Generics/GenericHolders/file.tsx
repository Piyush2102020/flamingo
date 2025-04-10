import React, { CSSProperties } from 'react';
import './style.css';

type HolderProps = {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  classname?:string;
  onClick?:()=>void;
  style?:CSSProperties
};

export const Holder: React.FC<HolderProps> = ({ style,onClick,classname,children, direction = 'vertical' }) => {
  return (
    <div style={style} onClick={onClick} className={`holder ${direction} ${classname}`}>
      {children}
    </div>
  );
};
