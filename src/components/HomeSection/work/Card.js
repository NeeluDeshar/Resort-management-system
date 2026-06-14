import React from "react"

const Card = ({title, desc, cover}) => {
  return (
    <>
    <div className='box'>
        <div className='img'>
            <img src={cover} alt='' />
        </div>
        <div className='details'>
            <h2>{title}</h2>
            <p>{desc}</p>
        </div>
    </div>
    </>
  )
}

export default Card