import {useState} from 'react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-header">
            <h1 className="contact-title">Get in touch</h1>
            <p className="contact-subtitle">
              Have a question or feedback? We&apos;d love to hear from you.
            </p>
          </div>

          {submitted ? (
            <div className="contact-success">
              <div className="contact-success__icon">✓</div>
              <h2>Thank you!</h2>
              <p>We&apos;ve received your message and will get back to you soon.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form__row">
                <div className="contact-form__field">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                  />
                </div>
                <div className="contact-form__field">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="contact-form__field">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                />
              </div>
              <div className="contact-form__field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell us what's on your mind..."
                />
              </div>
              <button type="submit" className="contact-form__submit">
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
