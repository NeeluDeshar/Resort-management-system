import React, { useState } from "react"
import Fcard from "./Fcard"
import Sdata from "./Sdata"
import "./Features.css"
import "../gallery/Gallery.css"

const AllItems = () => {
    const [items] = useState(Sdata)
  return (
    <>
       <section className ='gallery desi mtop'>
        <div className="container">
            <div className="content grid">
            {
    items.map((item) => {
        return <Fcard key={item.id} item={item} />
    })
}
            </div>
        </div>
       </section>
    </>
  )
}

export default AllItems