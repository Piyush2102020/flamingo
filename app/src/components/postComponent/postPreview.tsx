import { useEffect, useMemo, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import axiosInstance from "../../helpers/axiosModified";
import PostComponent from "./file";
import { ConditionalRendererWithDefault } from "../../newComponents/Generics/GenericConditionlRender/file";

export default function PostPreview(){
    const params=useParams();
    const postId=useMemo(()=>params.id,[params])
    const [postData,setPostData]=useState()

    const loadPost=async ()=>{
        if(!postId)return;
        if(postId){
            const postData=await axiosInstance.get(`/content/${postId}`);
            console.log(postData);
            setPostData(postData[0]);
        }
       
    }

    useEffect(()=>{
        loadPost();
    },[postId])
    return <ConditionalRendererWithDefault
    condition={!!postData}
    component={
        <PostComponent item={postData}/>
    }
    defaultComponent={
        "Loading post"
    }
    />
}