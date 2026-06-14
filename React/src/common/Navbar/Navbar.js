import React, { useState, useEffect, useRef } from "react"
import "./Navbar.css"
import { Link, useNavigate } from "react-router-dom"

const Navbar = () => {
  const [click, setClick] = useState(false)
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Read user from localStorage on mount and on storage changes
  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("user")
      setUser(stored ? JSON.parse(stored) : null)
    }
    syncUser()
    window.addEventListener("storage", syncUser)
    return () => window.removeEventListener("storage", syncUser)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setDropdownOpen(false)
    navigate("/")
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event("storage"))
  }

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U"

  const handleClick = () => setClick(!click)
  const closeMobileMenu = () => setClick(false)

  return (
    <>
      <nav className="navbar">
        <div className="container flex_space">
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
          </div>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
            <li><Link to="/about" onClick={closeMobileMenu}>About us</Link></li>
            <li><Link to="/gallery" onClick={closeMobileMenu}>Gallery</Link></li>
            <li><Link to="/features" onClick={closeMobileMenu}>Features</Link></li>
            <li><Link to="/blog" onClick={closeMobileMenu}>Blog</Link></li>
            <li><Link to="/room" onClick={closeMobileMenu}>Rooms</Link></li>
            <li><Link to="/navigation" onClick={closeMobileMenu}>Navigation</Link></li>
            <li><Link to="/contact" onClick={closeMobileMenu}>Contact Us</Link></li>
          </ul>

          <div className="login-area flex">
            {user ? (
              <div className="user-menu" ref={dropdownRef}>
                <button
                  className="user-avatar-btn"
                  onClick={() => setDropdownOpen((o) => !o)}
                  aria-label="User menu"
                >
                  <div className="user-avatar">{getInitials(user.name)}</div>
                  <span className="user-name-label">{user.name.split(" ")[0]}</span>
                  <i className={`fas fa-chevron-${dropdownOpen ? "up" : "down"} avatar-chevron`}></i>
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown__header">
                      <div className="user-avatar user-avatar--lg">{getInitials(user.name)}</div>
                      <div>
                        <p className="user-dropdown__name">{user.name}</p>
                        <p className="user-dropdown__email">{user.email}</p>
                      </div>
                    </div>
                    <div className="user-dropdown__divider" />
                    <button className="user-dropdown__item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <li>
                  <Link to="/sign-in">
                    <i className="far fa-chevron-right"></i>Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/register">
                    <i className="far fa-chevron-right"></i>Register
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/contact">
                <button className="primary-btn">Request a Quote</button>
              </Link>
            </li>
          </div>
        </div>
      </nav>

      <header>
        <div className="container flex_space">
          <div className="logo">
            <img src="images/logo(1).png" alt="Resort Logo" />
          </div>
          <div className="contact flex_space">
            <div className="box flex_space">
              <div className="icons"><i className="fal fa-clock"></i></div>
              <div className="text">
                <h4>Working Hours</h4>
                <Link to="/contact">Monday - Sunday: 9.00am to 6.00pm</Link>
              </div>
            </div>
            <div className="box flex_space">
              <div className="icons"><i className="fas fa-phone-volume"></i></div>
              <div className="text">
                <h4>Call Us</h4>
                <Link to="/contact">+977-9841688701</Link>
              </div>
            </div>
            <div className="box flex_space">
              <div className="icons"><i className="far fa-envelope"></i></div>
              <div className="text">
                <h4>Mail Us</h4>
                <Link to="/contact">info@exampal.com</Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar
