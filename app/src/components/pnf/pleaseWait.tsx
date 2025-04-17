import { useState } from 'react';
import { Holder } from '../../newComponents/Generics/GenericHolders/file';
import '../componentsGlobal.css'
import axiosInstance from '../../helpers/axiosModified';
export default function PleaseWait() {
    return (
        <div className='loader-page'>
            <div className="loader-wrapper">
                <div className="circular-loader"></div>
                <p style={{color:"black"}} className="loader-text">Please wait...</p>
            </div>
        </div>

    );
}




export const ShowOptions = ({ isUser, postId, cancelClick }: { isUser: boolean, postId: string, cancelClick: () => void }) => {

    const deletePost=()=>{
        axiosInstance.delete(`/content/${postId}`);
        cancelClick()
    }

    const report=()=>{
        axiosInstance.post(`/content/${postId}/interact?type=report`);
        cancelClick();
    }    
    return (
        <div style={{ position: "fixed", left: "0", top: "0" }} className='loader-page'>
            <div className="loader-wrapper">
                <Holder style={{ gap: "var(--gap-medium)", alignItems: "center" }}>
                    {isUser && <>  <p style={{ color: "red", textAlign: "center" }} onClick={deletePost} className="loader-text">Delete</p>          <div style={{ width: "100%", backgroundColor: "var(--color-shadow)", height: "1px" }}></div></>}
                    <p onClick={report} style={{color:"black", textAlign: "center" }} className="loader-text">Report</p>
                    <div style={{ width: "100%", backgroundColor: "var(--color-shadow)", height: "1px" }}></div>
                    <p  onClick={() => cancelClick()} style={{ color: "black" }} className="loader-text">Cancel</p>
                </Holder>
            </div>
        </div>
    )

}