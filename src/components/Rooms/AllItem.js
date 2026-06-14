import React, {useState} from "react"
import Tdata from "./Tdata"
import Card from "./Card"
import "./Rooms.css"


const AllItem = () => {
  const [items] = useState(Tdata)
  return (
    <>
    <section className='Rooms mtop'>
        <div className="container grid1">
          <div className="content grid">
            {items.map((item) =>{
                return <Card key={item.id} item={item} />
            })}

        </div>
        </div>
    </section>

    </>
  )
}

export default AllItem