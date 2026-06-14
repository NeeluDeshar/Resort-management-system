import React, { useState, useEffect } from "react"
import Card from "./Card"
import API from "../../api"
import "./Rooms.css"

const AllItem = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get("/rooms")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Failed to load rooms:", err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="rooms-section">
      <div className="container">
        {loading ? (
          <p className="rooms-loading">Loading rooms...</p>
        ) : items.length === 0 ? (
          <p className="rooms-empty">No rooms available at the moment.</p>
        ) : (
          <div className="rooms-grid">
            {items.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AllItem
