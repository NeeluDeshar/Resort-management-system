import React, { useEffect, useState } from "react"
import API from "../api"
import StatusBadge from "../components/StatusBadge"
import { MdDelete, MdFilterList } from "react-icons/md"
import "./TablePage.css"

const STATUSES = ["all", "pending", "confirmed", "checked_in", "cancelled"]

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState("all")
  const [search, setSearch]     = useState("")
  const [error, setError]       = useState("")

  const load = (status) => {
    setLoading(true)
    setError("")
    const url = status && status !== "all" ? `/admin/bookings?status=${status}` : "/admin/bookings"
    API.get(url)
      .then((r) => setBookings(r.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load bookings"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(filter) }, [filter])

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/admin/bookings/${id}/status`, { status })
      load(filter)
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status")
    }
  }

  const remove = async (id) => {
    if (!window.confirm("Delete this booking?")) return
    try {
      await API.delete(`/admin/bookings/${id}`)
      load(filter)
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete booking")
    }
  }

  const filtered = bookings.filter((b) =>
    b.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.room_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.phone?.includes(search)
  )

  return (
    <div>
      <h1 className="page-title">Room Bookings</h1>

      {error && <div className="page-error-banner">{error}</div>}

      <div className="page-toolbar">
        <input
          className="search-input"
          placeholder="Search by name, room, phone..."
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
                  <th>Phone</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Guests</th>
                  <th>Payment</th>
                  <th>Ref No.</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="11" className="table-empty">No bookings found</td></tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id}>
                      <td>#{b.id}</td>
                      <td><strong>{b.full_name}</strong></td>
                      <td>{b.phone}</td>
                      <td>{b.room_name}<br /><small style={{color:"#888"}}>{b.room_type}</small></td>
                      <td>{b.check_in}</td>
                      <td>{b.check_out}</td>
                      <td>{b.guests}</td>
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
                            <option value="checked_in">Checked In</option>
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

export default Bookings
