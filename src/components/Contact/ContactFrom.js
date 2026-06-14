import React, {useState} from "react"
import "./Contact.css"

const ContactFrom = () => {
 const [fname, setFname] = useState("")
 const [lname, setLname] = useState("")
 const [phone, setPhone] = useState("")
 const [email, setEmail] = useState("")
 const [subject, setSubject] = useState("")
 const [company, setCompany] = useState("")
 const [message, setMessage] = useState("")


 const [allValue, setAllValue] = useState([])
 const formSubmit = (e) => {
    e.preventDefault()
    const newValue ={fname, lname, phone, email, subject, company, message}
    setAllValue([...allValue,newValue])
    setFname("")
    setLname("")
    setPhone("")
    setEmail("")
    setSubject("")
    setCompany("")
    setMessage("")
 }
  return (
    <>
    <section className='contact mtop'>
        <div className='container flex'>
            <div className='main-content'>
                <h2>Contact Form</h2>
                <p>Fill out the form below, we will get back to you soon.</p>

                <form onSubmit={formSubmit}>
                    <div className='grid1'>
                        <div className='input'>
                            <span>
                                First Name <label>*</label>
                            </span>
                            <input type='text' name='fname' value={fname} onChange={(e)=> setFname(e.target.value)} />
                        </div>
                        <div className='input'>
                            <span>
                                Last Name <label>*</label>
                            </span>
                            <input type='text' name='lname' value={lname} onChange={(e)=> setLname(e.target.value)} />
                        </div>

                    <div className='input'>
                            <span>
                                Phone Number <label>*</label>
                            </span>
                            <input type='number' name='phone' value={phone} onChange={(e)=> setPhone(e.target.value)} />
                        </div>
                    </div>

                    <div className='input'>
                            <span>
                                Email <label>*</label>
                            </span>
                            <input type='email' name='email' value={email} onChange={(e)=> setEmail(e.target.value)} />
                        
                    </div>

                    <div className='input'>
                            <span>
                                subject 
                            </span>
                            <input type='text' name='subject' value={subject} onChange={(e)=> setSubject(e.target.value)} />
                        
                    </div>

                    <div className='input'>
                            <span>
                                Your Company
                            </span>
                            <input type='text' name='company' value={company} onChange={(e)=> setCompany(e.target.value)} />
                
                    </div>

                    <div className='input'>
                            <span>
                                Message <label>*</label>
                            </span>
                            <textarea cols='30' rows='10' name='message' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                        
                    </div>

                    <button className='primary-btn'>Submit Now</button>
                </form>
            </div>

            <div className='side-content'>
                <h3>Visit Our Location</h3>
                <div className="map-container">
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

    <section className='show-data'>
        {allValue.map((currentValue) => {
            const {fname, lname, phone, email, subject, company, message} =currentValue
       return(
        <div className='sing-box'>
            <h1>Send Sucessfully</h1>
            <h3>
                First Name : <p>{fname}</p>
            </h3>
            <h3>
                Last Name : <p>{lname}</p>
            </h3>
            <h3>
                Phone Number : <p>{phone}</p>
            </h3>
            <h3>
               Email : <p>{email}</p>
            </h3>
            <h3>
                Subject : <p>{subject}</p>
            </h3>
            <h3>
                Company : <p>{company}</p>
            </h3>
            <h3>
                Message : <p>{message}</p>
            </h3>
        </div>
       )
    })}
    </section>
    </>
  )

}

export default ContactFrom