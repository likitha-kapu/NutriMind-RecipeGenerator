import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Contact.css";

const Contact = () => {
  return (
    <>
      <Navbar />

      <div className="contact-page">

        <section className="contact-hero">
          <h1>Contact Us</h1>
          <p>
            Have feedback, suggestions, or questions about NutriMind?
            We'd love to hear from you.
          </p>
        </section>

        <section className="contact-section">

          <div className="contact-grid">

            <div className="contact-card">
              <h3>📧 Email</h3>
              <p>nutrimind.support@gmail.com</p>
            </div>

            <div className="contact-card">
              <h3>💡 Feedback</h3>
              <p>
                Share suggestions to improve the NutriMind platform.
              </p>
            </div>

            <div className="contact-card">
              <h3>⚙️ Project Info</h3>
              <p>
                Built using React, Node.js, MongoDB and AI APIs.
              </p>
            </div>

          </div>

        </section>

      </div>

      <Footer />
    </>
  );
};

export default Contact;