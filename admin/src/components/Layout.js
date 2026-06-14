import React, { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  MdDashboard, MdHotel, MdEvent, MdPeople,
  MdMeetingRoom, MdEmail, MdNewspaper, MdLogout, MdMenu, MdClose
} from "react-icons/md"
import "./Layout.css"

const nav = [
  { to: "/",              icon: <MdDashboard />,   label: "Dashboard" },
  { to: "/bookings",      icon: <MdHotel />,        label: "Room Bookings" },
  { to: "/event-bookings",icon: <MdEvent />,         label: "Event Bookings" },
  { to: "/users",         icon: <MdPeople />,        label: "Users" },
  { to: "/rooms",         icon: <MdMeetingRoom />,   label: "Rooms" },
  { to: "/contacts",      icon: <MdEmail />,         label: "Messages" },
  { to: "/newsletter",    icon: <MdNewspaper />,     label: "Newsletter" },
]

const Layout = ({ children }) => {
  const navigate  = useNavigate()
  const [open, setOpen] = useState(false)

  const logout = () => {
    localStorage.removeItem("adminToken")
    navigate("/login")
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
        <div className="sidebar__brand">
          <span className="sidebar__brand-dot"></span>
          <span>Resort Admin</span>
          <button className="sidebar__close" onClick={() => setOpen(false)}><MdClose /></button>
        </div>
        <nav className="sidebar__nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              <span className="sidebar__icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="sidebar__logout" onClick={logout}>
          <MdLogout /> Logout
        </button>
      </aside>

      {/* Main */}
      <div className="main">
        <header className="topbar">
          <button className="topbar__menu" onClick={() => setOpen(true)}><MdMenu /></button>
          <span className="topbar__title">Resort Management System</span>
          <button className="topbar__logout-btn" onClick={logout}>
            <MdLogout /> Logout
          </button>
        </header>
        <main className="content">{children}</main>
      </div>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </div>
  )
}

export default Layout
