import React from "react"
import HeadTitle from "../../common/HeadTitle/HeadTitle"
import "./navigation.css"
const Navigation = () => {
  return (
    <>
      <HeadTitle />
      <section className='navigation top'>
        <iframe
          title="Cosmos College Location" // Added title for accessibility
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.988483136437!2d85.3181722116607!3d27.655828027661695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb177c56a520d9%3A0xf3d0d1e37134dfb7!2sCosmos%20College%20of%20Management%20and%20Technology!5e0!3m2!1sen!2snp!4v1737953106858!5m2!1sen!2snp"
          width="600"
          height="450"
          style={{ border: '0' }} // Corrected style
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  )
}

export default Navigation