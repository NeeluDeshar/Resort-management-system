import React, { useEffect, useState } from "react"
import API from "../api"
import { MdDelete, MdEmail } from "react-icons/md"
import "./TablePage.css"

const Newsletter = () => {
  const [subs, setSubs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState("")
  const [error, setError]     = useState("")

  const load = () => {
    setLoading(true)
    setError("")
    API.get("/admin/newsletter")
      .then((r) => setSubs(r.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load subscribers"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const remove = async (id) => {
    if (!window.confirm("Remove this subscriber?")) return
    try {
      await API.delete(`/admin/newsletter/${id}`)
      load()
    } catch (err) {
      alert(err.response?.data?.error || "Failed to remove subscriber")
    }
  }

  const filtered = subs.filter((s) =>
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="page-title">Newsletter Subscribers</h1>

      {error && <div className="page-error-banner">{error}</div>}

      <div className="page-toolbar">
        <input
          className="search-input"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="record-count">{filtered.length} subscribers</span>
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
                  <th>Email</th>
                  <th>Subscribed On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="4" className="table-empty">No subscribers yet</td></tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id}>
                      <td>#{s.id}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <MdEmail style={{ color: "#31b675" }} />
                          {s.email}
                        </div>
                      </td>
                      <td>{new Date(s.subscribed_at).toLocaleDateString()}</td>
                      <td>
                        <button className="icon-btn icon-btn--red" onClick={() => remove(s.id)}>
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

export default Newsletter
