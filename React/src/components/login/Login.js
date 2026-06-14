import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import HeadTitle from "../../common/HeadTitle/HeadTitle"
import API from "../../api"
import "./design.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const submitForm = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    try {
      const res = await API.post("/auth/login", { email, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      window.dispatchEvent(new Event("storage"))
      setSuccess(`Welcome back, ${res.data.user.name}!`)
      setEmail("")
      setPassword("")
      setTimeout(() => navigate("/"), 1500)
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.")
    }
  }

  return (
    <>
      <HeadTitle />
      <section className='forms top'>
        <div className='container'>
          <div className='sign-box'>
            <p>Enter your e-mail and password below to log in to your account.</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={submitForm}>
              <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' required />
              <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' required />
              <div className='flex_space'>
                <div className='flex'>
                  <input type='checkbox' />
                  <label>Remember Me</label>
                </div>
                <div className='flex'>
                  <span>I forgot my password</span>
                </div>
              </div>
              <button type='submit' className='primary-btn'>Sign In</button>
              <p>Don't have account? <Link to='/register'>Signup!</Link></p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login
