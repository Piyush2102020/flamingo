
import { useDispatch, useSelector } from 'react-redux'
import './style.css'
import { addComments, changeCommentInput, changeParentId, setCommentBoxHint, toggleCommentBox } from '../../helpers/slice';
import { RootState } from '../../helpers/store';
import axiosInstance from '../../helpers/axiosModified';
import { useEffect} from 'react';
import CommentLayout from '../comment-layout/file';

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
  }, [])

  const addComment = async () => {
  
    axiosInstance.post(`/content/${postId}/comments/${commentBoxState.parentId}`, { content: commentBoxState.input });
  }

  return (
    <div className="comment-box-container">
      <div onClick={() => disptach(toggleCommentBox())} className="overlay"></div>

      <div className='comment-box'>

        <h1>Comments</h1>
        <div className='comments-container'>
          {commentBoxState.comments.length > 0 && commentBoxState.comments.map((value: any,index) => <CommentLayout key={index}  isReply={false} onClick={() => {
            disptach(setCommentBoxHint(`Replying to @${value.userData.username}`));
            disptach(changeCommentInput(`@${value.userData.username}`));
            disptach(changeParentId(value.parentId ? value.parentId : value._id));
          }} item={value} />)}
        </div>

        <div style={{width:'80%'}}>
          {commentBoxState.hint && <h2 className='text-light'>{commentBoxState.hint}</h2>}
          <div className='comment-input'>
            <input className='input' onChange={(event) => disptach(changeCommentInput(event.target.value))} value={commentBoxState.input} placeholder='Write a comment' />
            <button className='btn accent' onClick={addComment}>Add Comment</button>
          </div>

        </div>
      </div>
    </div>
  )
}