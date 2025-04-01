
import { useDispatch, useSelector } from 'react-redux'
import './style.css'
import { toggleCommentBox } from '../../helpers/slice';
import GenericLoader from '../GenericLoader/file';
import { RootState } from '../../helpers/store';
import axios from 'axios';
import axiosInstance from '../../helpers/axiosModified';
import { useState } from 'react';
import CommentLayout from '../comment-layout/file';

export default function CommentBox() {
    const disptach=useDispatch();

    const [comment,setComment]=useState("");
    const commentBoxState=useSelector((state:RootState)=>state.context.comment);
    const postId=commentBoxState.postId;


    const addComment=async()=>{
      console.log("Adding comment to post : ",postId);
      axiosInstance.post(`/content/${postId}/comments`,{content:comment})    
    }

    return (
      <div className="comment-box-container">
        <div onClick={()=>disptach(toggleCommentBox())} className="overlay"></div>




        <div className='comment-box'>

            <h1>Comments</h1>
            <div className='comments-container'>
              <GenericLoader url={`/content/${postId}/comments?`} Element={CommentLayout}/>
            </div>
            <div className='comment-input'>
                <input className='input' onChange={(event)=>setComment(event.target.value)} value={comment} placeholder='Write a comment'/>
                <button className='btn accent' onClick={addComment}>Add Comment</button>
            </div>
        </div>
      </div>
    )
}