import React, { useEffect, useState } from "react"
import API from "../api"
import { PUBLIC_SITE_URL } from "../config"
import { MdDelete, MdEdit, MdAdd, MdClose } from "react-icons/md"
import "./TablePage.css"
import "./RoomsManager.css"

const empty = { name: "", room_type: "", price: "", image: "", description: "", available: 1 }

const RoomsManager = () => {
  const [rooms, setRooms]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState(null) // null = add, object = edit
  const [form, setForm]         = useState(empty)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState("")

  const load = () => {
    setLoading(true)
    setError("")
    API.get("/admin/rooms")
      .then((r) => setRooms(r.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load rooms"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setModal(true) }
  const closeModal = () => setModal(false)

  const handle = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, available: Number(form.available) }
      if (editing) {
        await API.put(`/admin/rooms/${editing.id}`, payload)
      } else {
        await API.post("/admin/rooms", payload)
      }
      closeModal()
      load()
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save room")
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm("Delete this room?")) return
    try {
      await API.delete(`/admin/rooms/${id}`)
      load()
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete room")
    }
  }

  const toggle = async (id) => {
    try {
      await API.patch(`/admin/rooms/${id}/toggle`)
      load()
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update availability")
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Rooms Management</h1>
        <button className="add-btn" onClick={openAdd}>
          <MdAdd /> Add Room
        </button>
      </div>

      {error && <div className="page-error-banner">{error}</div>}

      <div className="card">
        {loading ? (
          <p className="table-loading">Loading...</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Price / night</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr><td colSpan="6" className="table-empty">No rooms found</td></tr>
                ) : (
                  rooms.map((r) => (
                    <tr key={r.id}>
                      <td>
                        {r.image
                          ? <img src={`${PUBLIC_SITE_URL}/${r.image}`} alt={r.name} className="room-thumb" />
                          : <div className="room-thumb room-thumb--empty">No img</div>
                        }
                      </td>
                      <td><strong>{r.name}</strong></td>
                      <td>{r.room_type}</td>
                      <td>Rs. {Number(r.price).toLocaleString()}</td>
                      <td>
                        <button
                          className={`toggle-btn ${r.available ? "toggle-btn--on" : "toggle-btn--off"}`}
                          onClick={() => toggle(r.id)}
                        >
                          {r.available ? "Available" : "Unavailable"}
                        </button>
                      </td>
                      <td>
                        <div className="action-row">
                          <button className="icon-btn icon-btn--blue" onClick={() => openEdit(r)}>
                            <MdEdit />
                          </button>
                          <button className="icon-btn icon-btn--red" onClick={() => remove(r.id)}>
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

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>{editing ? "Edit Room" : "Add New Room"}</h3>
              <button className="modal__close" onClick={closeModal}><MdClose /></button>
            </div>
            <form onSubmit={save} className="modal__form">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Room Name</label>
                  <input name="name" value={form.name} onChange={handle} required placeholder="e.g. Deluxe Room" />
                </div>
                <div className="form-group">
                  <label>Room Type</label>
                  <input name="room_type" value={form.room_type} onChange={handle} required placeholder="e.g. Suite" />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Price per Night (Rs.)</label>
                  <input name="price" type="number" value={form.price} onChange={handle} required placeholder="3000" />
                </div>
                <div className="form-group">
                  <label>Availability</label>
                  <select name="available" value={form.available} onChange={handle}>
                    <option value={1}>Available</option>
                    <option value={0}>Unavailable</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Image Path</label>
                <input name="image" value={form.image} onChange={handle} placeholder="images/room1.jpg" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handle} rows={3} placeholder="Describe the room..." />
              </div>
              <div className="modal__footer">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? "Saving..." : editing ? "Update Room" : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomsManager
