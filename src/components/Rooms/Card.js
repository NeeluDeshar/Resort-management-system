import React from "react"


const Card = ({ item: {id, image, room, name, price}}) => {
  return (
    <>
    <div className="items">
      <div className="img">
        <img src={image} alt='' />
      </div>
      <div className='category flex_space'>
        <span>{id}</span>
        <label>{room}</label>
      </div>

      <div className='details'>
        <h3>{name}</h3>
        <p>{price}</p>
      </div>

     
    </div>
    </>
  )
}

export default Card