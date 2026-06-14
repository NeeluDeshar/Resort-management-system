import React, { useEffect, useState } from "react"
import API from "../api"
import { MdDelete, MdPerson } from "react-icons/md"
import "./TablePage.css"

const Users = () => {
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState("")
  const [error, setError]     = useState("")

  const load = () => {
    setLoading(true)
    setError("")
    API.get("/admin/users")
      .then((r) => setUsers(r.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load users"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const remove = async (id) => {
    if (!window.confirm("Delete this user? Their bookings will remain.")) return
    try {
      await API.delete(`/admin/users/${id}`)
      load()
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user")
    }
  }

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="page-title">Registered Users</h1>

      {error && <div className="page-error-banner">{error}</div>}

      <div className="page-toolbar">
        <input
          className="search-input"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="record-count">{filtered.length} users</span>
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="5" className="table-empty">No users found</td></tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar"><MdPerson /></div>
                          <strong>{u.name}</strong>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td>
                        <button className="icon-btn icon-btn--red" onClick={() => remove(u.id)}>
                          <MdDelete />
                        </button>
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

export default Users
