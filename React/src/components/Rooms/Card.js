import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Rooms.css"

const Card = ({ item: { id, image, room_type, name, price, description, available } }) => {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  return (
    <div
      className={`room-card ${hovered ? "room-card--hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="room-card__image-wrap">
        <img src={`/${image}`} alt={name} className="room-card__image" />
        <span className={`room-card__badge ${available ? "room-card__badge--available" : "room-card__badge--unavailable"}`}>
          {available ? "Available" : "Booked"}
        </span>
        <span className="room-card__type">{room_type}</span>
      </div>

      <div className="room-card__body">
        <h3 className="room-card__name">{name}</h3>
        {description && <p className="room-card__desc">{description}</p>}

        <div className="room-card__footer">
          <div className="room-card__price">
            <span className="room-card__price-label">Per Night</span>
            <span className="room-card__price-value">Rs. {Number(price).toLocaleString()}</span>
          </div>
          <button
            className={`room-card__btn ${!available ? "room-card__btn--disabled" : ""}`}
            disabled={!available}
            onClick={() => available && navigate(`/booking/${id}`)}
          >
            {available ? "Book Now" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card
