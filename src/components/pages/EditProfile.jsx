import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"

export default function EditProfile({ handleLogout }) {
    const { username } = useParams()
    const [form, setForm] = useState({
        username: username,
        bio: ''
        // profilePic: '' 
        // edit user password?
    })
    const [msg, setMsg] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        const getUser = async () => {
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
                if (response.data.bio) {
                    setForm({ ...form, bio: response.data.bio })
                }
                // console.log(response.data)
            } catch (err) {
                console.warn(err)
                if (err.response) {
                    setMsg(err.response.data.msg)
                }
            }
        }
        getUser()
    }, [])

    const handleSubmit = async e => {
        try {
            e.preventDefault()
            // axios.put/.post('url', data for the req body)
            const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${username}/edit`, form)
            // navigate back to the details page for this bounty
            setForm({ username: response.data.username, bio: response.data.bio })
            navigate(`/${form.username}`)
        } catch (err) {
            console.warn(err)
            if (err.response) {
                setMsg(err.response.data.msg)
            }
        }
    }
    const handleDeleteUser = async (e) => {
        try {
            e.preventDefault()
            // get the token from local storage
            const token = localStorage.getItem('jwt')
            // make the auth headers
            const options = {
                headers: {
                    'Authorization': token
                }
            }
            // hit the auth locked endpoint
            const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${username}`, options)
            handleLogout()
            navigate('/')

        } catch (err) {
            console.warn(err)
        }
    }

    return (
        <div>
            <h1>Edit Profile:</h1>
            <p>{msg}</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='username'>Username:</label>
                    <input
                        type='text'
                        id='username'
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor='bio'>Bio:</label>
                    <input
                        type='text'
                        id='bio'
                        value={form.bio}
                        onChange={e => setForm({ ...form, bio: e.target.value })}
                    />
                </div>

                <button type='submit' style={{ backgroundColor: '#FC6767', width: '150px' }}>Submit</button>
            </form>

            <Link to={`/${username}`}>
                <button style={{ backgroundColor: '#FC6767', width: '150px' }}>Cancel</button>
            </Link>
            <button onClick={handleDeleteUser} style={{ backgroundColor: 'red', width: '150px' }}>Delete Account</button>
        </div>
    )
}