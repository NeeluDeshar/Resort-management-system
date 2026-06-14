import React from "react"
import "./StatusBadge.css"

const colors = {
  pending:    "badge--yellow",
  confirmed:  "badge--green",
  checked_in: "badge--blue",
  completed:  "badge--blue",
  cancelled:  "badge--red",
}

const StatusBadge = ({ status }) => (
  <span className={`badge ${colors[status] || "badge--gray"}`}>
    {status?.replace("_", " ")}
  </span>
)

export default StatusBadge
