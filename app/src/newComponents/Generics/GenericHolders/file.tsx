import React from 'react';
import './style.css';

type HolderProps = {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  classname?:string;
};

export const Holder: React.FC<HolderProps> = ({ classname,children, direction = 'vertical' }) => {
  return (
    <div className={`holder ${direction} ${classname}`}>
      {children}
    </div>
  );
};
