import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const slice = createSlice(
    {
        name: 'context',
        initialState: {
            userData: {},
            comment: {
                commentBoxId: "",
                isVisible: false,
                postId: '',
                parentId: '',
                input: '',
                comments: [],
                hint: ''
            },
            inbox: [],
            newMessage: false,
            newNotification: false,
            isMobile: false,



            chatbox: {
                receiverId: "",
                receiverUsername: "",
                chatboxId: "",
                receiverProfilePicture: ""
            },
        },
        reducers: {
            addData: (state, action: PayloadAction<{}>) => { state.userData = action.payload },
            setCommentBoxID: (state, action: PayloadAction<string>) => { state.comment.commentBoxId = action.payload },
            toggleCommentBox: (state) => { state.comment.isVisible = !state.comment.isVisible },
            setPostId: (state, action: PayloadAction<"">) => { state.comment.postId = action.payload },
            setParentId: (state, action: PayloadAction<"">) => { state.comment.parentId = action.payload },
            toggleNotification: (state) => { state.newNotification = !state.newNotification },
            toggleMessage: (state) => { state.newMessage = !state.newMessage },
            setIsMobile: (state, action: PayloadAction<boolean>) => { state.isMobile = action.payload },
            setCommentBoxHint: (state, action: PayloadAction<string>) => { state.comment.hint = action.payload },

            changeCommentInput: (state, action: PayloadAction<string>) => {
                if (!action.payload.includes("@")) {
                    state.comment.parentId = '';
                    state.comment.hint = '';
                }
                state.comment.input = action.payload
            },
            changeParentId: (state, action: PayloadAction<string>) => { state.comment.parentId = action.payload },
            addComments: (state, action: PayloadAction<[]>) => {
                if (action.payload.length == 0) {
                    state.comment.comments = []
                } else {
                    state.comment.comments = [...state.comment.comments, ...action.payload]
                }
            },


            addUsersInInbox: (state, action) => {state.inbox = action.payload},
            updateChatboxMeta:(state,action)=>{
                const keys=Object.keys(action.payload);
                for (let key of keys){
                    console.log(key);
                    
                    state.chatbox[key]=action.payload[key]
                }
            }

        }
    }
)


export const { updateChatboxMeta,setCommentBoxHint, addComments, addData, setCommentBoxID, changeParentId, changeCommentInput, toggleCommentBox, setPostId, setParentId, toggleNotification, toggleMessage, setIsMobile, addUsersInInbox } = slice.actions;
export default slice.reducer;