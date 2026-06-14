import React, { useState } from "react"

const Card = ({ images, title }) => {
    const [popup, setPopup] = useState(false)
    const toggleModal = () => {
        setPopup(!popup)
    }
    return (
        <>
            <div className='items'>
                <div className='img'>
                    <img src={images} alt='' />
                    <i className='fas fa-image' aria-label="Open Image" onClick={toggleModal}></i>
                </div>
                <div className='title'>
                    <h3>{title}</h3>
                </div>
            </div>

            {popup && (
                <div className='popup'>
                    <div className='hide'></div>
                    <div className='popup-content'>
                        <button onClick={toggleModal}>Close</button>
                        <img src={images} alt='' />
                    </div>
                </div>
            )}
        </>
    )
}

export default Card