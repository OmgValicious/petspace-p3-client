import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Search() {
    const [search, setSearch] = useState('')
    const [results, setResults] = useState([])
    const [msg, setMsg] = useState('')

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users`)
                setResults(response.data)
                // console.log(results)

            } catch (err) {
                if (err.response) {
                    setMsg(err.response.data.msg)
                }
            }
        }
        getUsers()
    }, [])



    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    const filteredUsers = results.filter(result => {
        return result.username.toLowerCase().includes(search.toLowerCase())
    })

    const handleClear = () => {
        setSearch('')
    }



    const userLinks = filteredUsers.map(user => {
        const photoCheck = () => {
            if (user.image) {
                return (
                    <>
                        <img src={user.image} className="card-img-top mx-auto" style={{ width: "20rem", height: "auto" }} />
                    </>
                )
            } else {
                return (
                    <>
                        <img src={require('../../assets/paw.png')} className="card-img-top mx-auto" style={{ width: "20rem", height: "auto" }} />
                    </>
                )
            }
        }
        return (

            <div className='d-flex justify-content-center' key={user._id}>
                <div className="card" style={{ width: "30rem", height: "auto" }} key={user._id}>
                    {photoCheck()}
                    <div className="card-body">
                        <Link className="card-title" to={`/${user.username}`}>@{user.username}</Link>
                        <p className="card-text">{`Posts: ${user.posts.length} Follwers: ${user.followers.length} Following: ${user.following.length}`}</p>

                    </div>
                </div>
            </div>
        )
    })


    return (
        <div>
             <div>
                <form>
                    <input
                        type='text'
                        id='username'
                        value={search}
                        placeholder='search username...'
                        onChange={handleSearch}
                    />
                    <button onClick={handleClear} style={{ backgroundColor: '#FC6767', width: '150px' }}>Clear</button>
                </form>
            </div>

            <div>
                <h1 className='fw-bold'>Results:</h1>

                {userLinks}

                <p>{msg}</p>
            </div>


        </div>
    )
}