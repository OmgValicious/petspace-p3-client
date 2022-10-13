import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"

export default function EditPost() {
    const [form, setForm] = useState('')
    const [msg, setMsg] = useState('')

    const { postid } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const getPost = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/${postid}`)
                setForm(response.data.content)
            } catch (err) {
                console.warn(err)
                if (err.response) {
                    setMsg(err.response.data.msg)
                }
            }
        }
        getPost()
    }, [])

    const handleSubmit = async e => {
        try {
            e.preventDefault()
            // axios.put/.post('url', data for the req body)
            const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/${postid}`, { content: form })
            setForm(response.data.content)
            navigate(`/posts/${postid}`)

        } catch (err) {
            console.warn(err)
            if (err.response) {
                setMsg(err.response.data.msg)
            }
        }
    }

    return (
        <div>
            <h1>Edit Post Caption:</h1>
            <p>{msg}</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <textarea className='card-text inputBarPosts border m-0 p-2'
                        name='content'
                        type='text'
                        id='content'
                        value={form}
                        onChange={e => setForm(e.target.value)}
                        style={{ height: "15rem", fontSize: "14pt", width: "100%" }}
                    ></textarea>
                </div>

                <button type='submit' style={{ backgroundColor: '#FC6767', width: '150px' }}>Submit</button>
                <Link to={`/posts/${postid}`}>
                    <button style={{ backgroundColor: '#FC6767', width: '150px' }}>Cancel</button>
                </Link>
            </form>

        </div>
    )
}