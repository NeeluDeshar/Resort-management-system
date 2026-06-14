import React, { useState } from "react"
import "./Footer.css"
import { Link } from "react-router-dom"
import API from "../../api"

const Footer = () => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState(null) // { type: "success" | "error", text: string }
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    const trimmed = email.trim()

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus({ type: "error", text: "Please enter a valid email address." })
      return
    }

    setLoading(true)
    setStatus(null)

    try {
      const res = await API.post("/newsletter", { email: trimmed })
      setStatus({ type: "success", text: res.data.message || "Thank you for subscribing!" })
      setEmail("")
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong. Please try again."
      setStatus({ type: "error", text: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <footer>
        <div className='container grid'>
          <div className='box'>
            <h2>ABOUT US</h2>
            <p>Lorem ipsum dolor sit amet sectetur adipiscing elit amet consectetur scing elit amet consectetur adipiscing elit sed et eletum.</p>
            <br />
            <p>Lorem ipsum dolor sit amet sectetur adipiscing elit amet consectetur scing elit amet.</p>
            <div className='icon flex_space'>
              <i className='fab fa-facebook-f'></i>
              <i className='fab fa-twitter'></i>
              <i className='fab fa-linkedin'></i>
              <i className='fab fa-instagram'></i>
              <i className='fab fa-pinterest'></i>
              <i className='fab fa-youtube'></i>
            </div>
          </div>

          <div className='box'>
            <h2>NAVIGATION</h2>
            <ul>
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/about'>About us</Link></li>
              <li><Link to='/gallery'>Gallery</Link></li>
              <li><Link to='/features'>Features</Link></li>
              <li><Link to='/blog'>Blog</Link></li>
              <li><Link to='/testimonial'>Testimonial</Link></li>
              <li><Link to='/contact'>Contact Us</Link></li>
            </ul>
          </div>

          <div className='box post'>
            <h2>RECENT POSTS</h2>
            <ul>
              <li>
                <p>Lorem ipsum dolor sit amet sectetur adipiscing elit amet</p>
                <label className='fa fa-calendar-alt'></label>
                <span>01 Oct 2024</span>
              </li>
              <li>
                <p>Lorem ipsum dolor sit amet sectetur adipiscing elit amet</p>
                <label className='fa fa-calendar-alt'></label>
                <span>01 Oct 2024</span>
              </li>
              <li>
                <p>Lorem ipsum dolor sit amet sectetur adipiscing elit amet</p>
                <label className='fa fa-calendar-alt'></label>
                <span>01 Oct 2024</span>
              </li>
            </ul>
          </div>

          <div className='box'>
            <h2>NEWSLETTER</h2>
            <p>Subscribe to get the latest resort deals, events, and updates delivered to your inbox.</p>

            <form className='newsletter-form' onSubmit={handleSubscribe} noValidate>
              <input
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status) setStatus(null)
                }}
                disabled={loading}
              />
              <button
                type='submit'
                className='newsletter-btn'
                disabled={loading}
              >
                {loading ? "..." : "SUBSCRIBE"}
              </button>
            </form>

            {status && (
              <p className={`newsletter-msg newsletter-msg--${status.type}`}>
                {status.type === "success" && <i className='fas fa-check-circle'></i>}
                {status.type === "error" && <i className='fas fa-exclamation-circle'></i>}
                {" "}{status.text}
              </p>
            )}
          </div>
        </div>
      </footer>

      <div className='legal'>
        <p>© 2025 All Rights Reserved.</p>
      </div>
    </>
  )
}

export default Footer
