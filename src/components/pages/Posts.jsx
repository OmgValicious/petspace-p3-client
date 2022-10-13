import { useState, useEffect } from "react"
import axios from "axios"
import Moment from 'react-moment';
import { Link } from 'react-router-dom'


export default function Posts({ currentUser }){
	
    const [posts, setPosts] = useState([])
    const [msg, setMsg] = useState("")
    const [comment, setComment] = useState("")
    const [commentNum, setCommentNum] = useState({})   
    const [like, setLike] = useState({})
    const [likeNum, setLikeNum] = useState({})
   
    useEffect(() => {
        const getPosts = async () => {
            try{
                const options = {
                    headers: {
                        'userid': currentUser.id
                    }
                }
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts`, options)
                setPosts(response.data)
                response.data.forEach((post) => {
                    likeNum[post._id] = post.likes.length
                    setLikeNum(likeNum)
                    commentNum[post._id] = post.comments.length
                    post.likes.forEach((love) => {
                        if (love.user === currentUser.id) {
                        like[post._id] = true
                        setLike(like)
                        }
                    })
                })
                
            }catch(err){
                console.warn(err)
                if(err.response) {
                    setMsg(err.response.data.msg)
                }
            }
        }
        getPosts()
},[currentUser, likeNum])


const handleComment = async (e, post_id) => {
    e.preventDefault()
    try{
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/${post_id}/comments`, {content: comment, userId : currentUser.id})
        setComment("")
        commentNum[post_id] = commentNum[post_id] + 1
        setCommentNum(commentNum)
    }catch(err){
        console.warn(err)
        if(err.response) {
            setMsg(err.response.data.msg)
        }
    }
}

const handleLikes = async (postid) => {
    try{
        if (like[postid]) {
            const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/${postid}/like`, {userId: currentUser.id})
            like[postid] = false
            setLike(like)
            setLikeNum({...likeNum, postid: response.data.likes.length})
        } else {
            // need to check this route again after setting up on backend to account for likes on both Post model and User model
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/${postid}/like`, {userId: currentUser.id})
            like[postid] = true
            setLike(like)
            setLikeNum({...likeNum, postid: response.data.likes.length})
        }
        
    }catch(err){
        console.warn(err)
        if(err.response) {
            setMsg(err.response.data.msg)
        }
    }
}

const renderPosts = posts.map((post, idx) => {
    return (
       <div className="container " key={post._id}>
        <div className="row justify-content-center">
            <div className="col-sm-8 p-0">
                    <div className="card my-2" key={`key-${idx}`}>
                        <div className="card-header d-flex align-items-center justify-content-between">
                            <div className='col d-flex align-items-center justify-content-between'>
                                <div className="d-flex">
                                    <h6 className='mb-0 fw-bold'>{post.user.username}</h6>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Link to={`/posts/${post._id}`} className='commentsLink'>
                                        <i className="bi bi-three-dots d-flex justify-content-end"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                            
                        <div className="card-body p-0">
                            <div>
                                <img src={post.photo} alt={post._id} className='mw-100' height="auto"/>
                            </div>
                        </div>
                            

                        <div className="card-footer row p-0 m-0">
                            <div className='col d-flex align-items-center justify-content-between'>
                                <div className='d-flex p-0'>
                                    {like[post._id]? <button className='postsLikeBtn' onClick={() => handleLikes(post._id)}>❤️</button> : <button className='postsLikeBtn' onClick={() => handleLikes(post._id)}>🤍</button>}
                                    <p className="ms-2 mt-3">{likeNum[post._id]} likes</p>
                                </div>
                                <div>
                                    <Moment fromNow>{post.createdAt}</Moment>
                                </div>
                            </div>
                            <div className='d-flex justify-content-start align-items-center'>
                                <h4 className='fw-bold ms-0 mt-3'>{post.user.username}</h4>
                                <h4 className='ms-2 mt-3'>{post.content}</h4>
                            </div>

                            <div className='d-flex justify-content-start mt-2 border-bottom p-2'>
                                <p><Link to={`/posts/${post._id}`} className='commentsLink'>View all {commentNum[post._id]} comments</Link> </p>
                            </div>
                            <div className='row d-flex p-1 m-0'>
                                <form className='p-0 m-auto' onSubmit={(e) => handleComment(e, post._id)}>
                                    <div className='col m-0 p-0'>
                                        <div className='d-flex justify-content-start'>
                                            <label className='form-label' htmlFor="comment"><i className="bi bi-emoji-smile"></i> {currentUser.username}</label>
                                        </div>
                                        <div className='row d-flex justify-content-start m-0 p-1'>
                                            <input type="text" className='col-10 d-flex inputBarPosts border justify-content-start' placeholder='add comment...' value={comment} onChange={(e) => setComment(e.target.value)} id="comment"/>
                                            <button type="submit" className='col-sm-2 d-flex p-0 m-1 justify-content-center align-items-center subBtnPosts' style = {{backgroundColor: '#FC6767', width: '80px' }}>Submit</button>
                                        </div>
                                        
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>

    )

})
    return(
        <div>        
            {msg}
            {renderPosts} 
        </div>
    )
}