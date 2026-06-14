import React, { useState } from "react"
import API from "../../api"
import "./Contact.css"

const ContactFrom = () => {
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [company, setCompany] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const formSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    try {
      await API.post("/contact", { fname, lname, phone, email, subject, company, message })
      setSuccess("Message sent successfully! We will get back to you soon.")
      setFname(""); setLname(""); setPhone(""); setEmail("")
      setSubject(""); setCompany(""); setMessage("")
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send message. Please try again.")
    }
  }

  return (
    <>
      <section className='contact mtop'>
        <div className='container flex'>
          <div className='main-content'>
            <h2>Contact Form</h2>
            <p>Fill out the form below, we will get back to you soon.</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <form onSubmit={formSubmit}>
              <div className='grid1'>
                <div className='input'>
                  <span>First Name <label>*</label></span>
                  <input type='text' name='fname' value={fname} onChange={(e) => setFname(e.target.value)} required />
                </div>
                <div className='input'>
                  <span>Last Name <label>*</label></span>
                  <input type='text' name='lname' value={lname} onChange={(e) => setLname(e.target.value)} required />
                </div>
                <div className='input'>
                  <span>Phone Number</span>
                  <input
                    type='tel'
                    name='phone'
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10)
                      setPhone(val)
                    }}
                    placeholder='10-digit phone number'
                    maxLength={10}
                    pattern='\d{10}'
                    title='Phone number must be exactly 10 digits'
                  />
                </div>
              </div>

              <div className='input'>
                <span>Email <label>*</label></span>
                <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className='input'>
                <span>Subject</span>
                <input type='text' name='subject' value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className='input'>
                <span>Your Company</span>
                <input type='text' name='company' value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div className='input'>
                <span>Message <label>*</label></span>
                <textarea cols='30' rows='10' name='message' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
              </div>

              <button className='primary-btn'>Submit Now</button>
            </form>
          </div>

          <div className='side-content'>
            <h3>Visit Our Location</h3>
            <div className="map-container">
              <iframe
                title="Cosmos College Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.988483136437!2d85.3181722116607!3d27.655828027661695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb177c56a520d9%3A0xf3d0d1e37134dfb7!2sCosmos%20College%20of%20Management%20and%20Technology!5e0!3m2!1sen!2snp!4v1737953106858!5m2!1sen!2snp"
                width="600"
                height="450"
                style={{ border: "0" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <br />
            <h3>Message</h3>
            <span>info@example.com</span>
            <br />
            <span>+977-9841688701</span>
            <br />
            <div className='icon'>
              <h3>Follow Us</h3>
              <div className='flex_space'>
                <i className='fab fa-facebook-f'></i>
                <i className='fab fa-twitter'></i>
                <i className='fab fa-linkedin'></i>
                <i className='fab fa-instagram'></i>
                <i className='fab fa-youtube'></i>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactFrom
