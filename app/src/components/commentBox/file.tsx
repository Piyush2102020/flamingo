import { useDispatch, useSelector } from 'react-redux'
import { addComments, changeCommentInput, changeParentId, setCommentBoxHint, toggleCommentBox } from '../../helpers/slice';
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

    axiosInstance.post(`/content/${postId}/comments/${commentBoxState.parentId}`, { content: commentBoxState.input });
  }

  return (
    <div className="comment-box-container">
      <div onClick={() => disptach(toggleCommentBox())} className="overlay"></div>

      <div className='comment-box'>

        <h1>Comments</h1>
        <div className='comments-container'>
          {commentBoxState.comments.length > 0 && commentBoxState.comments.map((value: any, index) => <CommentLayout key={index} isReply={false} onClick={() => {
            disptach(setCommentBoxHint(`Replying to @${value.userData.username}`));
            disptach(changeCommentInput(`@${value.userData.username}`));
            disptach(changeParentId(value.parentId ? value.parentId : value._id));
          }} item={value} />)}
        </div>

        <div style={{ width: '70%',justifyContent:"center",alignItems:"center" }}>
          <ConditionalRendererWithoutDefault
            condition={!!commentBoxState.hint.trim()}
            component={<TextHint text={commentBoxState.hint} />}
          />
          <Holder direction='horizontal' classname='comment-input'>
            <BasicInputField onChange={(event) => disptach(changeCommentInput(event.target.value))} value={commentBoxState.input} placeholder='Write a comment' />
            <BasicButton onClick={addComment} text='Add Comment' />
          </Holder>


        </div>
      </div>
    </div>
  )
}