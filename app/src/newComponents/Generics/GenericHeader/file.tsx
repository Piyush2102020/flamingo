import React, { CSSProperties } from 'react'
import './style.css'
import { Holder } from '../GenericHolders/file';
import { SmallIcon, SmallImage } from '../../Clickables/icons/file';
import { ClickableBoldText } from '../../Clickables/text/file';
import { TextHint } from '../GenericText/file';
import { timeAgo } from '../../../helpers/timesAgo';
import { ConditionalRendererWithoutDefault } from '../GenericConditionlRender/file';

type HeaderProps = {
    style?: CSSProperties;
    classname?: string;
    imagePath: string;
    headText: string;
    hintText?: string;
    timestamp?: string;
    showIcon?: boolean;
    decorate?:boolean;
    children?: React.ReactNode;
    clickType: "header" | "text";
    component?:React.ReactNode;
    onClick?: () => void;
    content?:string;
}



export const GenericHeader: React.FC<HeaderProps> = ({ component,style,decorate=true,content, classname, imagePath, headText
    , hintText,
    onClick,
    timestamp, showIcon = true, children, clickType = 'header'
}) => {
    return (
        <Holder onClick={clickType=='header'?onClick:undefined}  direction='horizontal'>
            <SmallImage imgPath={imagePath} />
            <Holder>
                <Holder style={{alignItems:"center"}} direction='horizontal'>
                    <ClickableBoldText onClick={clickType == 'text' ? onClick : undefined} text={headText} />
                    <ConditionalRendererWithoutDefault
                        condition={decorate}
                        component={"•"} />
                    <TextHint text={timestamp?timeAgo(timestamp):""} />
                </Holder>

                <TextHint text={hintText||""} />
                {content?.trim()&&content}
                {component}
            </Holder>
            {children}
            <ConditionalRendererWithoutDefault
            condition={showIcon}
            component={ <SmallIcon icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>} />}
            />
           
        </Holder>
    )
}