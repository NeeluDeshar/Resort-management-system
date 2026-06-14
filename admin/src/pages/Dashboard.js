import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../api"
import StatusBadge from "../components/StatusBadge"
import {
  MdPeople, MdHotel, MdEvent, MdMeetingRoom,
  MdEmail, MdNewspaper, MdAttachMoney, MdPending
} from "react-icons/md"
import "./Dashboard.css"

const StatCard = ({ icon, label, value, color, to }) => (
  <Link to={to || "#"} className="stat-card" style={{ "--accent": color }}>
    <div className="stat-card__icon">{icon}</div>
    <div>
      <div className="stat-card__value">{value ?? "—"}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  </Link>
)

const Dashboard = () => {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get("/admin/dashboard")
      .then((r) => setStats(r.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page-loading">Loading dashboard...</div>
  if (!stats)  return <div className="page-error">Failed to load dashboard.</div>

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      <div className="stat-grid">
        <StatCard icon={<MdPeople />}      label="Total Users"        value={stats.total_users}        color="#8b5cf6" to="/users" />
        <StatCard icon={<MdHotel />}       label="Total Bookings"     value={stats.total_bookings}     color="#3b82f6" to="/bookings" />
        <StatCard icon={<MdPending />}     label="Pending Bookings"   value={stats.pending_bookings}   color="#f59e0b" to="/bookings" />
        <StatCard icon={<MdHotel />}       label="Confirmed Bookings" value={stats.confirmed_bookings} color="#6366f1" to="/bookings" />
        <StatCard icon={<MdEvent />}       label="Total Events"       value={stats.total_events}       color="#a855f7" to="/event-bookings" />
        <StatCard icon={<MdEvent />}       label="Pending Events"     value={stats.pending_events}     color="#ec4899" to="/event-bookings" />
        <StatCard icon={<MdMeetingRoom />} label="Available Rooms"    value={`${stats.available_rooms} / ${stats.total_rooms}`} color="#31b675" to="/rooms" />
        <StatCard icon={<MdEmail />}       label="Contact Messages"   value={stats.total_contacts}     color="#06b6d4" to="/contacts" />
        <StatCard icon={<MdNewspaper />}   label="Subscribers"        value={stats.newsletter_subs}    color="#64748b" to="/newsletter" />
        <StatCard icon={<MdAttachMoney />} label="Est. Revenue (Rs.)" value={Number(stats.total_revenue).toLocaleString()} color="#10b981" />
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section__header">
          <h2>Recent Room Bookings</h2>
          <Link to="/bookings" className="view-all">View All</Link>
        </div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_bookings.length === 0 ? (
                <tr><td colSpan="6" className="table-empty">No bookings yet</td></tr>
              ) : (
                stats.recent_bookings.map((b) => (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td>{b.full_name}</td>
                    <td>{b.room_name}</td>
                    <td>{b.check_in}</td>
                    <td>{b.check_out}</td>
                    <td><StatusBadge status={b.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
