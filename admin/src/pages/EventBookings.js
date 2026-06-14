import React, { useEffect, useState } from "react"
import API from "../api"
import StatusBadge from "../components/StatusBadge"
import { MdDelete, MdFilterList } from "react-icons/md"
import "./TablePage.css"

const STATUSES = ["all", "pending", "confirmed", "completed", "cancelled"]

const EventBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState("all")
  const [search, setSearch]     = useState("")
  const [error, setError]       = useState("")

  const load = (status) => {
    setLoading(true)
    setError("")
    const url = status && status !== "all"
      ? `/admin/event-bookings?status=${status}`
      : "/admin/event-bookings"
    API.get(url)
      .then((r) => setBookings(r.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load event bookings"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(filter) }, [filter])

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/admin/event-bookings/${id}/status`, { status })
      load(filter)
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status")
    }
  }

  const remove = async (id) => {
    if (!window.confirm("Delete this event booking?")) return
    try {
      await API.delete(`/admin/event-bookings/${id}`)
      load(filter)
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete event booking")
    }
  }

  const filtered = bookings.filter((b) =>
    b.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.event_type?.toLowerCase().includes(search.toLowerCase()) ||
    b.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="page-title">Event Bookings</h1>

      {error && <div className="page-error-banner">{error}</div>}

      <div className="page-toolbar">
        <input
          className="search-input"
          placeholder="Search by name, event type, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          <MdFilterList style={{ color: "#888", fontSize: 18 }} />
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`filter-tab ${filter === s ? "filter-tab--active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s === "all" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p className="table-loading">Loading...</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Guest</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Event Type</th>
                  <th>Date</th>
                  <th>Guests</th>
                  <th>Duration</th>
                  <th>Payment</th>
                  <th>Ref No.</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="12" className="table-empty">No event bookings found</td></tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id}>
                      <td>#{b.id}</td>
                      <td><strong>{b.full_name}</strong></td>
                      <td>{b.email}</td>
                      <td>{b.phone}</td>
                      <td><span className="event-tag">{b.event_type}</span></td>
                      <td>{b.event_date}</td>
                      <td>{b.guests}</td>
                      <td>{b.duration}</td>
                      <td>{b.payment_method}</td>
                      <td>{b.reference_number || <span style={{color:"#bbb"}}>—</span>}</td>
                      <td><StatusBadge status={b.status} /></td>
                      <td>
                        <div className="action-row">
                          <select
                            className="status-select"
                            value={b.status}
                            onChange={(e) => updateStatus(b.id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button className="icon-btn icon-btn--red" onClick={() => remove(b.id)}>
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventBookings
