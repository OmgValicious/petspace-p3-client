import { useState } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { Navigate, Link } from 'react-router-dom'

export default function Login({ currentUser, setCurrentUser }) {
	// state for the controlled form
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [msg, setMsg] = useState('')

	// submit event handler
	const handleSubmit = async e => {
		e.preventDefault()
		try {
			// post fortm data to the backend
			const reqBody = {
				email,
				password
			}
			const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/login`, reqBody)

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
		<div className='Login'>
			<div className='container'>
				<div className='row content d-flex justify-content-center align-content-center'>
					<div className='col-md-5'>
						<div className='form-box shadow bg-white p-4 rounded'>
							<div className='mb-3 border-bottom border-3 border-dark'>
								<img src={require('../../assets/petspaceBlk.png')} className='formLg mb-2' />
							</div>

							<div>
								<p className='mb-4 text-center fs-6 formTitle'>Login to Your Account</p>
								<p>{msg}</p>
							</div>
							<form className='mb-3' onSubmit={handleSubmit}>
								<div className='form-floating mb-3'>
									<input
										className="form-control form-control-sm rounded "
										type="email"
										id="floatingInput"
										placeholder='your email...'
										onChange={e => setEmail(e.target.value)}
										value={email}
										required
									/>
									<label htmlFor='floatingInput'>Email:</label>
								</div>

								<div className='form-floating mb-3'>
									<input
										className="form-control form-control-sm rounded"
										type="password"
										id="floatingPassword"
										placeholder='password...'
										onChange={e => setPassword(e.target.value)}
										value={password}
										required
									/>
									<label htmlFor='floatingPassword'>Password:</label>
								</div>
								<div className='d-grid gap-2 mb-3'>
									<button type="submit" className='btn btn-dark btn-lg border-0 rounded-4'>Login</button>
								</div>
							</form>
							<div className='sign-up-accounts d-flex justify-content-center'>
								<p>Don't have an account? <Link to='/register'> Sign up</Link></p>

							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	)
}