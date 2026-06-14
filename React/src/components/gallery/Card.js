import React, { useState, useEffect } from "react"

const Card = ({ images, title }) => {
  const [open, setOpen] = useState(false)

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open])

  if (!images) return null

  return (
    <>
      <div className="items" onClick={() => setOpen(true)}>
        <div className="img">
          <img src={images} alt={title} />
          <i className="fas fa-expand" aria-label="Open Image"></i>
        </div>
        <div className="title">
          <h3>{title}</h3>
        </div>
      </div>

      {open && (
        <div className="lightbox" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox__close" onClick={() => setOpen(false)} aria-label="Close">
              <i className="fas fa-times"></i>
            </button>
            <img src={images} alt={title} className="lightbox__image" />
            {title && <p className="lightbox__title">{title}</p>}
          </div>
        </div>
      )}
    </>
  )
}

export default Card
