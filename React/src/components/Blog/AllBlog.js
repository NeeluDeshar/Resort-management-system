import React, { useState, useEffect } from "react"
import BlogCard from "./BlogCard"
import API from "../../api"
import "./BlogHome.css"

const AllBlog = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get("/blog")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Failed to load blog posts:", err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="blog top">
      <div className="container">
        {loading ? (
          <p>Loading blog posts...</p>
        ) : (
          <div className="content grid">
            {items.map((item) => (
              <BlogCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AllBlog
