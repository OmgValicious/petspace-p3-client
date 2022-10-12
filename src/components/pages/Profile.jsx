import { useState, useEffect, useRef} from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Moment from 'react-moment';
import Modal from 'react-modal';
Modal.setAppElement('*'); 


export default function Profile({ currentUser, handleLogout }) {
	const [posts, setPosts] = useState([])
	const [errorMessage, setErrorMessage] = useState('')
	const [user, setUser] = useState([])
	const [profile, setProfile] = useState(true)
	const [followers, setFollowers] = useState([])
	const [following, setFollowing] = useState([])
	const [follow, setFollow] = useState(false)
	const [msg, setMsg] = useState('')
	const [modalIsOpen, setModalIsOpen] = useState(false);

	
	const { username } = useParams()
	
	// Cloudinary 
	const [fileInputState, setFileInputState] = useState('')
	// const [selectedFile, setSelectedFile] = useState('')
	// const [previewSource, setPreviewSource] = useState('')
	// const [imageIds, setImagesIds] = useState()
	
	
	// Multer
	const inputRef = useRef(null)
	const [formImg, setFormImg] = useState('')
	
    const setModalIsOpenToTrue =()=>{
        setModalIsOpen(true)
    }

	const setModalIsOpenToFalse =()=>{
        setModalIsOpen(false)
    }

	const handleFileInputChange = (e) => {
		const file = e.target.files[0]
		// previewFile(file);
		setFormImg(file)
	}

	// Find a profile
	useEffect(() => {
		const getProfile = async () => {
			try {
				// get the token from local storage
				const token = localStorage.getItem('jwt')
				// make the auth headers
				const options = {
					headers: {
						'Authorization': token
					}
				}
				// hit the auth locked endpoint
				const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${username}`, options)
				//check if currentUser is already following the profile they are viewing to display 'follow/unfollow' correctly when landing on '/:username'
				if (response.data.followers.includes(currentUser.id)) {
					setFollow(true)
				}
				//check to see if user is viewing their own profile and set Profile state accordingly
				if (currentUser.id === response.data._id) {
					setProfile(true)
				} else { setProfile(false) }

				setUser(response.data)
				setFollowing(response.data.following)
				setFollowers(response.data.followers)
				setPosts(response.data.posts)
				// setFriends(response.data.friends)
			} catch (err) {
				console.warn(err)
				handleLogout()
			}
		}
		getProfile()
		//username is passed in the array to render the useEffect again each time user goes to different user's profile
	}, [username])

	const handleDeletePost = async (postId) => {
		try {
			await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/${postId}`)
			// get the token from local storage
			const token = localStorage.getItem('jwt')
			// make the auth headers
			const options = {
				headers: {
					'Authorization': token
				}
			}
			// hit the auth locked endpoint
			const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${username}`, options)
			setPosts(response.data.posts)

		} catch (err) {
			console.warn(err)
		}
	}
	
	// console.log(posts[1].comments, 'SS')
    // const renderComments = posts[1].comments.map((comment, idx) => {
    //     return (
    //         <div key={`comment-${comment._id}-${idx}`}>
    //             <div className="row p-0 d-flex border-bottom border-2">
    //                 <div className='col-md-9 d-flex p-0 align-items-start mt-1 ms-2'>
    //                    <p><span className='fw-bold d-flex'>{comment.user.username}: </span>
    //                      {comment.content}</p>
    //                 </div>
    //                 <div className='col-sm-2 d-flex align-items-center'>
    //                     {comment.user.username === currentUser.username ?<div className='d-flex justify-content-end align-items-center p-0'> 
    //                     {/* <Link className='p-0 m-1 btnComment' to={`/posts/${postid}/comments/${comment._id}/edit`}> */}
    //                     <button className="btnComment p-0 shadow-none"><i className="bi bi-pencil-square"></i></button>
    //                     {/* </Link>  */}
    //                     </div>: <p></p>}
    //                     {/* <button onClick={handleCommentLikes}>Like</button> */}
    //                 </div>
    //                     <div className="d-flex justify-content-end">
    //                         <Moment fromNow>{comment.createdAt}</Moment>
    //                     </div>
    //             </div>

    //         </div>
    //     )
    // })


	// Render Posts to a map
	const renderPostsAll = posts.map((post, idx) => {
		console.log(post)
		return (
			// <div key={`key-${idx}`}>
			// 	{/* <img src={post.photo} alt={post._id}/> */}
				
				
			// 	<p>{post.content}</p>
			// 	<Moment fromNow>{post.createdAt}</Moment>
			// 	{/* need to map an array of comments and hide it on Posts route */}
			// 	{/* <p>{post.comment}</p> */}
			// 	{/* changed this to '.length' to show number of likes */}
			// 	<p>{post.likes.length} likes</p>

			// </div>

			<div key={`key-${idx}`} className="post">
				<h1 className="postTitlePage my-3">Post</h1>
				<div className='container d-flex justify-content-center'>
				<div className="card mb-3 border postCard" style={{width: "75vw"}}>
                    <div className="row g-0">
                         {/* Holds image for card */}
                        <div className="col-md-6 align-items-center">
                            <img src={post.photo} alt={post.id} className='rounded-start postImage' style={{height: "auto"}} />
                        </div>
						<div className="col-md-6">
                            {/* Header + Like and edit buttons */}
                            <div className='card-header d-flex justify-content-between postCardHeader'>
                                <div>
                                    <a href={`/${user.username}`} className='postCardTitle'>
                                        <h5 className="card-title d-flex justify-content-start mt-1 fw-bold">@{user.username}</h5>
                                    </a>
                                </div>
								<div className="row card-body d-flex justify-content-start p-0 m-1">
                                    {/* <div className='col-7 me-0 p-0'> */}
                                        <p className="card-text">{post.content}</p>
                                    {/* </div> */}
                            </div>
							<div className='card-body d-flex p-0 m-2 justify-content-between align-items-center cardPostBody'>
                                        <div className='d-flex align-items-top'>
                                            {/* <button onClick={handleLikes} type='button' className='mx-2 p-0 shadow-none likeBtnPost'> */}
                                            {/* {like ? "❤️" : "🤍"}</button> */}
                                            
                                            {/* <p className='mt-2'>{likes} likes</p> */}
                                        </div>
                                        <p className="card-text mt-2"><Moment fromNow>{post.createdAt}</Moment></p>
                                    </div>
									<div className="row card-body d-flex justify-content-start commentsSection p-0 m-1">

							<div className='cardComments'>
								
								{/* Render the list of comments */}
								{/* {renderComments} */}
							</div>
							</div>
						</div>
						</div>
						</div>
						</div>
						</div>



			</div>
			 
		)
	})
		
	// const renderPostsUser = posts.map((post, idx) => {
	// 	// console.log(posts)
	// 	return (
	// 		<div className='d-flex justify-content-center'  key={`key-${idx}`}>
	// 		<div className="card" style={{width: "25rem", height: "auto"}}>
	// 			<img src={post.photo} alt={post._id} style={{width: "25rem"}}/>
	// 			<p>{post.content}</p>
	// 			<Moment fromNow>{post.createdAt}</Moment>
	// 			{/* need to map an array of comments and hide it on Posts route */}
	// 			{/* <p>{post.comment}</p> */}
	// 			{/* changed this to '.length' to show number of likes */}
	// 			<div className="card-body">
	// 			<p>{post.likes.length} likes</p>
	// 			<Link to={`/posts/${post._id}/edit`}>
	// 				<button style={{ backgroundColor: '#FC6767', width: '150px' }}>Edit</button>
	// 			</Link>
	// 			<button style={{ backgroundColor: '#FC6767', width: '150px' }} onClick={(e) => handleDeletePost(post._id)}>Delete</button>
	// 			</div>
	// 		</div>
	// 		</div>
	// 	)
	// })
	const handleFollowClick = async (e) => {
		try {
			e.preventDefault()
			//sending currentUser and 'follow' state to backend to add follower/following if 'follow' is clicked, and remove follower/following if 'unfollow' is clicked on both currentUser and currentProfile users in the db
			const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${username}`, { currentUser: currentUser, status: follow })
			setFollowing(response.data.following)
			setFollowers(response.data.followers)
			//'follow' state switch between follow/unfollow on click event
			setFollow(!follow)

		} catch (err) {
			console.warn(err)
		}
	}


	const handlePhotoUpdate = async e => {
		e.preventDefault()
		try {
			// post form data to the backend
			const formData = new FormData()
			formData.append('userId', user._id)
			formData.append('image', formImg)
			const options = {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			}
			const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${username}/photo`, formData, options)
			setUser(response.data)
			setModalIsOpenToFalse()

		} catch (err) {
			console.warn(err)
			if (err.response) {
				setMsg(err.response.data.msg)
			}
		}
	}


	const bioCheck = () => {
		if (user.bio) {
			return (
				<h3 className='userBio'>{user.bio}</h3>
			)
		} else {
			return (
				<p>Click 'Edit Profile' to add a bio...</p>
			)
		}
	}
	let photoMsg;
	const photoCheck = () => {
		if (user.image) {
			photoMsg = 'Change Photo'
			return (
				<>
					<img src={user.image} className='rounded-5 mw-100 profilePic' />
				</>
			)
		} else {
			photoMsg = 'Add Photo'
			return (
				<>
					<img src={require('../../assets/paw.png')} className='rounded-5 mw-100 profilePic' />
				</>
			)
		}
	}

	const viewUserProfile = (
		<div className='profile'>
			{/* if the user viewing their own profile... */}
			<div className='container text-center'>
				<div className='row mt-5'>
					
					<div className='col-11 ms-auto justify-content-start' style={{ display: 'flex', position: "relative"}}>
						{photoCheck()}
						<Modal isOpen={modalIsOpen}>
								<button onClick={setModalIsOpenToFalse}>close</button>
								<form className='mb-3' onSubmit={handlePhotoUpdate}>
								<div className="form-floating mb-3">
									<input className="form-control form-control-sm"
										type = "file"  
										name = "image" 
										id = "image"
										ref = {inputRef}					
										onChange={handleFileInputChange} 
										value={fileInputState}    
									/>
									<label htmlFor='file'>Upload Profile Photo:</label>
									
								</div>
								<div className='d-grid gap-2 mb-3'>
									<button type="submit" className='btn btn-dark btn-lg border-0 rounded-4'>Submit</button>
									
								</div>
								</form>
            			</Modal>	
						
						</div>
					</div>
					<div className='col-7 me-auto'>
						<div className='row col-7 justify-content-center'>
							<div className='col-5' style={{display: "inline-block"}}>
							<button onClick={setModalIsOpenToTrue}className='btn btn-sm btn-outline-secondary btn-light fw-bold' style={{ backgroundColor: '#FC6767', width: '150px' }}>{photoMsg}</button>
							</div>
							
							<div className='col-1 me-auto justify-content-end' style={{display: "inline-block"}}>
								<Link to={`/${username}/edit`} className=''>
									<button className='btn btn-sm btn-outline-secondary btn-light fw-bold'  style={{ backgroundColor: '#FC6767', width: '150px', }}>Edit Profile</button>
								</Link>
								<h3 className='me-auto row' style={{display:'flex', fontSize: "30px"}}>@{username}</h3>
							</div>

						</div>
						<div className='row justify-content-start'>
							<div className='col-2 m-0 fw-bold'><p>{posts.length} Posts</p></div>
							<div className='col-3 m-0 fw-bold'><p>{followers.length} Followers</p></div>
							<div className='col-3 m-0 fw-bold'><p>{following.length} Following</p></div>
						</div>
					</div>



					{bioCheck()}

					{/* <ul>Posts: {renderPostsAll}</ul> */}
				</div>

				<div className='row'>

				</div>

			</div>
	)

	const viewOtherProfile = (
		// if the user is viewing someone else's profile...
		<div className='profile'>

		<div className='container text-center'>
			<div className='row mt-5'>
				<div className='col-11 ms-auto justify-content-start' style={{ display: 'flex', position: "relative"}}>
					{photoCheck()} 

					</div>
				</div>
				<div className='col-7 me-auto'>
					<div className='row justify-content-space-between'>
						<div className='col-5'>
							
							<h3 style={{fontSize: "30px"}}>@{username}</h3>
							<p>{user.bio}</p>
						<button onClick={handleFollowClick} 
							className='btn btn-sm btn-outline-secondary btn-light fw-bold' 
							style={{ backgroundColor: '#FC6767', width: '150px' }}>
							{follow ? "unfollow" : "Follow"}
					</button>
						</div>

					</div>
					<div className='row justify-content-start'>
						<div className='col-2 m-0 fw-bold'><p>{posts.length} Posts</p></div>
						<div className='col-3 m-0 fw-bold'><p>{followers.length} Followers</p></div>
						<div className='col-3 m-0 fw-bold'><p>{following.length} Following</p></div>
					</div>
				</div>




			{/* <ul>Posts: {renderPostsAll}</ul> */}
			</div>
		</div>
)

	return (
		<div>
			{/* conditionally render based on currentUser and profileUser */}
			{profile ? viewUserProfile : viewOtherProfile}
			<ul>Posts: {renderPostsAll}</ul>
		</div>
	)
	
}
