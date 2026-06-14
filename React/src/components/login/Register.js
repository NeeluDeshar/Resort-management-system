import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import HeadTitle from "../../common/HeadTitle/HeadTitle"
import API from "../../api"
import "./design.css"

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cpassword, setCpassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const submitForm = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (password !== cpassword) {
      setError("Passwords do not match")
      return
    }
    try {
      await API.post("/auth/register", { name, email, password, cpassword })
      setSuccess("Account created successfully! Redirecting to login...")
      setName(""); setEmail(""); setPassword(""); setCpassword("")
      setTimeout(() => navigate("/sign-in"), 1500)
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.")
    }
  }

  return (
    <>
      <HeadTitle />
      <section className='forms top'>
        <div className='container'>
          <div className='sign-box'>
            <p>Don't have an account? Create your account, it takes less than a minute.</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={submitForm}>
              <input type='text' name='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' required />
              <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' required />
              <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' required />
              <input type='password' name='cpassword' value={cpassword} onChange={(e) => setCpassword(e.target.value)} placeholder='Confirm Password' required />
              <button type='submit' className='primary-btn'>Create an Account</button>
              <p>Already have an account? <Link to='/sign-in'>Sign In!</Link></p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default Register
