import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const slice=createSlice(
    {
        name:'context',
        initialState:{
            userData:{},
            comment:{
                commentBoxId:"",
                isVisible:false,
                postId:'',
                parentId:''
            },
            newMessage:false,
            newNotification:false,
            isMobile:false
        },
        reducers:{
            addData:(state,action:PayloadAction<{}>)=>{state.userData=action.payload},
            setCommentBoxID:(state,action:PayloadAction<string>)=>{state.comment.commentBoxId=action.payload},
            toggleCommentBox:(state)=>{state.comment.isVisible=!state.comment.isVisible},
            setPostId:(state,action:PayloadAction<"">)=>{state.comment.postId=action.payload},
            setParentId:(state,action:PayloadAction<"">)=>{state.comment.parentId=action.payload},
            toggleNotification:(state)=>{state.newNotification=!state.newNotification},
            toggleMessage:(state)=>{state.newMessage=!state.newMessage},
            setIsMobile:(state,action:PayloadAction<boolean>)=>{state.isMobile=action.payload}
        }
    }
)


export const {addData,setCommentBoxID,toggleCommentBox,setPostId,setParentId,toggleNotification,toggleMessage,setIsMobile}=slice.actions;
export default slice.reducer;