import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Moment from 'react-moment';
import Modal from 'react-modal';
import ProfilePosts from './ProfilePosts'
Modal.setAppElement('*');


export default function Profile({ currentUser, handleLogout }) {
	const [posts, setPosts] = useState([])
	const [user, setUser] = useState([])
	const [profile, setProfile] = useState(true)
	const [followers, setFollowers] = useState([])
	const [following, setFollowing] = useState([])
	const [follow, setFollow] = useState(false)
	const [msg, setMsg] = useState('')
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [previewSource, setPreviewSource] = useState('')


	const { username } = useParams()

	// Cloudinary 
	const [fileInputState, setFileInputState] = useState('')


	// Multer
	const inputRef = useRef(null)
	const [formImg, setFormImg] = useState('')

	const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); //Converts the file to a url
        reader.onloadend = () => { //Once the reader is done loading
            setPreviewSource(reader.result);

        }
    }

	const setModalIsOpenToTrue = () => {
		setModalIsOpen(true)
	}

	const setModalIsOpenToFalse = () => {
		setModalIsOpen(false)
	}

	const handleFileInputChange = (e) => {
		const file = e.target.files[0]
		previewFile(file);
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
				setMsg(err.response.data.msg)
				handleLogout()
			}
		}
		getProfile()
		//username is passed in the array to render the useEffect again each time user goes to different user's profile
	}, [username, follow])



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
				<h3 className='fs-4'>{user.bio}</h3>
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
					<img src={user.image} className='rounded-5' style={{ width: '300px', height: 'auto' }} />
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
		<div>
			{/* if the user viewing their own profile... */}
			<div className='container text-center'>
				<div className='col-12 ms-auto justify-content-center'>
					{photoCheck()}
					<h3 className='col-12 ms-auto justify-content-center' style={{ display: 'flex', fontSize: "30px" }}>@{username}</h3>
					{bioCheck()}
					<Modal isOpen={modalIsOpen}>
						<button onClick={setModalIsOpenToFalse}>close</button>
						<form className='mb-3' onSubmit={handlePhotoUpdate}>
							<div className="form-floating mb-3">
								<input className="form-control form-control-sm"
									type="file"
									name="image"
									id="image"
									ref={inputRef}
									onChange={handleFileInputChange}
									value={fileInputState}
									accept=".jpg, .jpeg, .png"
									style={{ color: formImg ? 'transparent' : '' }}
								/>
								<label htmlFor='file'>Upload Profile Photo:</label>
							</div>
							{previewSource ?
								<img src={previewSource} alt="User uploaded image" style={{ height: 'auto', width: '100%' }} /> : ''
							}
							<div className='d-grid gap-2 mb-3'>
								<button type="submit" className='btn btn-dark btn-lg border-0 rounded-4'>Submit</button>

							</div>
						</form>
					</Modal>
				</div>

				<div className='d-flex justify-content-center'>
					<div className='col-1 fw-bold'><p>{posts.length} Posts</p></div>
					<div className='col-1 fw-bold'><p>{followers.length} Followers</p></div>
					<div className='col-1 fw-bold'><p>{following.length} Following</p></div>
				</div>

				<div className='col-12 ms-auto'>
					<div className='d-flex justify-content-center'>
						<div className='d-flex justify-content-center'>
							<button onClick={setModalIsOpenToTrue} className='btn btn-sm btn-outline-secondary btn-light fw-bold' style={{ backgroundColor: '#FC6767', width: '150px' }}>{photoMsg}</button>
						</div>

						<Link to={`/${username}/edit`}>
							<button className='btn btn-sm btn-outline-secondary btn-light fw-bold' style={{ backgroundColor: '#FC6767', width: '150px', }}>Edit Profile</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)

	const viewOtherProfile = (
		// if the user is viewing someone else's profile...
		<div className='container text-center'>
			<div className='col-12 ms-auto justify-content-center'>
				{photoCheck()}
				<h3 className='col-12 ms-auto justify-content-center' style={{ display: 'flex', fontSize: "30px" }}>@{username}</h3>
				{user.bio}
			</div>

			<div className='d-flex justify-content-center'>
				<div className='col-1 fw-bold'><p>{posts.length} Posts</p></div>
				<div className='col-1 fw-bold'><p>{followers.length} Followers</p></div>
				<div className='col-1 fw-bold'><p>{following.length} Following</p></div>
			</div>

			<button onClick={handleFollowClick}
				className='btn btn-sm btn-outline-secondary btn-light fw-bold'
				style={{ backgroundColor: '#FC6767', width: '150px' }}>
				{follow ? "unfollow" : "Follow"}
			</button>
		</div>

	)

	return (
		<div>
			{msg}
			{/* conditionally render based on currentUser and profileUser */}
			{profile ? viewUserProfile : viewOtherProfile}
			<ProfilePosts username={username} currentUser={currentUser} follow={follow} />
		</div>
	)

}
