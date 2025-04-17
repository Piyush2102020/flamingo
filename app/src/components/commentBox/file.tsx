import { useDispatch, useSelector } from 'react-redux'
import { addComments, changeCommentInput, changeParentId, newComment, setCommentBoxHint, toggleCommentBox } from '../../helpers/slice';
import { RootState } from '../../helpers/store';
import axiosInstance from '../../helpers/axiosModified';
import { useEffect } from 'react';
import CommentLayout from '../comment-layout/file';
import { BasicInputField } from '../../newComponents/Clickables/fields/file';
import { BasicButton } from '../../newComponents/Clickables/buttons/file';
import { Holder } from '../../newComponents/Generics/GenericHolders/file';
import { ConditionalRendererWithoutDefault } from '../../newComponents/Generics/GenericConditionlRender/file';
import { TextHint } from '../../newComponents/Generics/GenericText/file';

export default function CommentBox() {
  const disptach = useDispatch();
  const commentBoxState = useSelector((state: RootState) => state.context.comment);
  const user = useSelector((state: RootState) => state.context.userData);
  const postId = commentBoxState.postId;


  const loadComments = async () => {
    const comments = await axiosInstance.get(`/content/${postId}/comments`) as [];
    if (comments) {
      disptach(addComments(comments));
    }
  }


  useEffect(() => {
    loadComments();
  }, []);

  const addComment = async () => {

    const response=await axiosInstance.post(`/content/${postId}/comments/${commentBoxState.parentId}`, { content: commentBoxState.input });
    disptach(setCommentBoxHint(""));
    disptach(changeCommentInput(""));
    const newCommentToAdd={...response,userData:{
      username:user.username,
      name:user.name,
      _id:user._id,
      profilePicture:user.profilePicture
    }};

    console.log("New comment : ",newCommentToAdd);
    disptach(newComment(newCommentToAdd));
  }

  return (
    <div className="comment-box-page">
      <div onClick={() => disptach(toggleCommentBox())} className="overlay"></div>

      <div className='comment-box-parent'>

        <h1>Comments</h1>
        <div className='all-comments'>
          {commentBoxState.comments.length > 0 && commentBoxState.comments.map((value: any, index) => <CommentLayout key={index} isReply={false} onClick={() => {
            disptach(setCommentBoxHint(`Replying to @${value.userData.username}`));
            disptach(changeCommentInput(`@${value.userData.username}`));
            disptach(changeParentId(value.parentId ? value.parentId : value._id));
          }} item={value} />)}
        </div>

        <div style={{ width: '95%',justifyContent:"center",alignItems:"center" }}>
          <ConditionalRendererWithoutDefault
            condition={!!commentBoxState.hint.trim()}
            component={<TextHint text={commentBoxState.hint} />}
          />
          <Holder style={{alignItems:"center"}} classname='comment-box-input' direction='horizontal'>
            <BasicInputField style={{flexGrow:'1'}} onChange={(event) => disptach(changeCommentInput(event.target.value))} value={commentBoxState.input} placeholder='Write a comment' />
            <BasicButton style={{width:"fit-content"}} onClick={addComment} text='Add Comment' />
          </Holder>
        </div>
      </div>
    </div>
  )
}