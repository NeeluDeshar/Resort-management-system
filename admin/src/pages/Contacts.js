import React, { useEffect, useState } from "react"
import API from "../api"
import { MdDelete, MdExpandMore, MdExpandLess } from "react-icons/md"
import "./TablePage.css"

const Contacts = () => {
  const [msgs, setMsgs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState("")
  const [expanded, setExpanded] = useState(null)
  const [error, setError]         = useState("")

  const load = () => {
    setLoading(true)
    setError("")
    API.get("/admin/contacts")
      .then((r) => setMsgs(r.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load messages"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const remove = async (id) => {
    if (!window.confirm("Delete this message?")) return
    try {
      await API.delete(`/admin/contacts/${id}`)
      load()
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete message")
    }
  }

  const filtered = msgs.filter((m) =>
    `${m.fname} ${m.lname}`.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.subject?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="page-title">Contact Messages</h1>

      {error && <div className="page-error-banner">{error}</div>}

      <div className="page-toolbar">
        <input
          className="search-input"
          placeholder="Search by name, email, subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="record-count">{filtered.length} messages</span>
      </div>

      <div className="card">
        {loading ? (
          <p className="table-loading">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="table-empty" style={{ padding: "40px", textAlign: "center" }}>No messages found</p>
        ) : (
          <div className="messages-list">
            {filtered.map((m) => (
              <div key={m.id} className={`message-item ${expanded === m.id ? "message-item--open" : ""}`}>
                <div className="message-item__header" onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                  <div className="message-item__from">
                    <strong>{m.fname} {m.lname}</strong>
                    <span>{m.email}</span>
                    {m.phone && <span>{m.phone}</span>}
                  </div>
                  <div className="message-item__subject">{m.subject || "No subject"}</div>
                  <div className="message-item__meta">
                    <span className="message-date">{new Date(m.created_at).toLocaleDateString()}</span>
                    <button className="icon-btn icon-btn--red" onClick={(e) => { e.stopPropagation(); remove(m.id) }}>
                      <MdDelete />
                    </button>
                    {expanded === m.id ? <MdExpandLess style={{fontSize:20,color:"#888"}} /> : <MdExpandMore style={{fontSize:20,color:"#888"}} />}
                  </div>
                </div>
                {expanded === m.id && (
                  <div className="message-item__body">
                    {m.company && <p><strong>Company:</strong> {m.company}</p>}
                    <p className="message-text">{m.message || <em style={{color:"#aaa"}}>No message</em>}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Contacts
