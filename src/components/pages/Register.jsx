import { useState, useRef,useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { Navigate, Link } from 'react-router-dom'

export default function Register({ currentUser, setCurrentUser }) {
	// state for the controlled form
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [msg, setMsg] = useState('')
	
	    // Cloudinary 
		const [fileInputState, setFileInputState] = useState('')
	
	
		// Multer
		const inputRef = useRef(null)
		const [formImg, setFormImg] = useState('')

		const handleFileInputChange = (e) => {
			const file = e.target.files[0]
			// previewFile(file);
			setFormImg(file)
		}
		
		

	// submit event handler
	const handleSubmit = async e => {
		e.preventDefault()
		try {
			// post fortm data to the backend
			const formData = new FormData()
			formData.append('username', username)
			formData.append('email', email)
			formData.append('password', password)
			formData.append('image', formImg)
			const options = {
				headers: {
					"Content-Type" : "multipart/form-data"
				}
			}
			const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/register`, formData, options)

			// save the token in localstorage
			const { token } = response.data
			localStorage.setItem('jwt', token)

			// decode the token
			const decoded = jwt_decode(token)

			// set the user in App's state to be the decoded token
			setCurrentUser(decoded)

		} catch (err) {
			console.warn(err)
			if (err.response) {
				setMsg(err.response.data.msg)
			}
		}
 	}

	// conditionally render a navigate component
	if (currentUser) {
		return <Navigate to={`/${currentUser.username}`} />
	}

	return (
		<div className='Register'>
			<div className='container'>
				<div className='row content justify-content-center align-content-center inner-row'>
					<div className='col-md-5'>
						<div className='form-box bg-white p-4 rounded'>
							<div className='mb-3 border-bottom border-3 border-dark'>
								<img src={require('../../assets/petspaceBlk.png')} className='formLg mb-2'/>
							</div>

							<div>
								<p className='mb-4 text-center fs-6'>Register for an account</p>
								<p>{msg}</p>
							</div>
							<form className='mb-3' onSubmit={handleSubmit}>
								<div className='form-floating mb-3'>
									<input className="form-control form-control-sm rounded"
										type="text"
										id="floatingInput"
										placeholder='your username...'
										onChange={e => setUsername(e.target.value)}
										name='username'
										value={username}
										required
									/>
									<label htmlFor='floatingInput'>Username:</label>
								</div>
								<div className="form-floating mb-3">
									<input className='form-control form-control-sm' 
										type="email"
										id="email"
										placeholder='your email...'
										onChange={e => setEmail(e.target.value)}
										value={email}
										required
									/>
									<label htmlFor='email'>Email:</label>
								</div>

								<div className="form-floating mb-3">
									<input className="form-control form-control-sm"
										type="password"
										id="password"
										placeholder='password...'
										onChange={e => setPassword(e.target.value)}
										value={password}
										required
									/>
									<label htmlFor='password'>Password:</label>
								</div>

						
								<div className="form-floating mb-3">
									<input className="form-control form-control-sm"
										type = "file"  
										name = "image" 
										id = "image"
										ref = {inputRef}					
										onChange={handleFileInputChange} 
										value={fileInputState}
										accept=".jpg, .jpeg, .png"
										style = {{height: '60px', color: formImg ? 'transparent' : ''}}

									/>
								<div className="preview">
   									 <p>{formImg ? 'Profile photo uploaded successfully!' : 'No profile photo currently selected'}</p>
  								</div>

									<label htmlFor='file'>Profile Photo (optional):</label>
								</div>
								
								<div className='d-grid gap-2 mb-3'>
									<button type="submit" className='btn btn-dark btn-lg border-0 rounded-4'>Register</button>
								</div>
								
							</form>
							<div className='sign-up-accounts d-flex justify-content-center'>
								<p>Already have an account? <Link to='/'> Login</Link></p>
								
							</div>
						</div>
					</div>
				</div>
			</div>
			
			
		</div>
	)
}