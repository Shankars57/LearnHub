import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";
import { Heart, Mail, MapPin, Phone, Send } from "lucide-react";

const ContactPage = () => {
  const formRef = useRef(null);

  const sendEmail = (event) => {
    event.preventDefault();

    emailjs
      .sendForm("service_acz2rvi", "template_7ofk82r", formRef.current, {
        publicKey: "TXN1gH5hEouwIyjVO",
      })
      .then(
        () => {
          toast.success("Message sent successfully.");
          formRef.current?.reset();
        },
        () => {
          toast.error("Failed to send the message. Please try again.");
        }
      );
  };

  return (
    <section className="theme-page pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="theme-card rounded-3xl p-6 sm:p-9">
          <h1
            className="text-3xl sm:text-5xl font-extrabold"
            style={{ fontFamily: "Roboto Mono, monospace" }}
          >
            Contact LearnHub
          </h1>
          <p className="theme-muted mt-4 max-w-3xl leading-relaxed">
            Questions, partnership ideas, product feedback, or issue reports are
            all welcome. Send a message and we will respond as soon as possible.
          </p>
        </div>

        <div className="theme-surface rounded-3xl p-5 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="theme-card rounded-2xl p-4 flex items-center gap-3">
            <Mail className="theme-accent" size={22} />
            <div>
              <p className="text-xs uppercase tracking-wider theme-muted">Email</p>
              <p className="text-sm">bonamgshankar@gmail.com</p>
            </div>
          </article>
          <article className="theme-card rounded-2xl p-4 flex items-center gap-3">
            <Phone className="theme-accent" size={22} />
            <div>
              <p className="text-xs uppercase tracking-wider theme-muted">Phone</p>
              <p className="text-sm">+91 9110560147</p>
            </div>
          </article>
          <article className="theme-card rounded-2xl p-4 flex items-center gap-3">
            <MapPin className="theme-accent" size={22} />
            <div>
              <p className="text-xs uppercase tracking-wider theme-muted">Location</p>
              <p className="text-sm">Peddapuram, Andhra Pradesh, India</p>
            </div>
          </article>
        </div>

        <form
          ref={formRef}
          onSubmit={sendEmail}
          className="theme-surface rounded-3xl p-5 sm:p-7 space-y-5"
        >
          <h2 className="text-2xl font-semibold">Send a Message</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fromName" className="block text-sm theme-muted mb-1">
                Your Name
              </label>
              <input
                id="fromName"
                type="text"
                name="from_name"
                required
                placeholder="Ex: John Doe"
                className="theme-input w-full rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="replyTo" className="block text-sm theme-muted mb-1">
                Your Email
              </label>
              <input
                id="replyTo"
                type="email"
                name="reply_to"
                required
                placeholder="Ex: john@example.com"
                className="theme-input w-full rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm theme-muted mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              required
              placeholder="What would you like to discuss?"
              className="theme-input w-full rounded-xl px-3 py-2 resize-none outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="theme-btn rounded-xl px-5 py-3 text-sm font-semibold inline-flex items-center gap-2"
          >
            <Send size={16} />
            Send Message
          </button>
        </form>

        <div className="text-sm theme-muted flex items-center justify-center gap-2">
          <span>Copyright {new Date().getFullYear()} LearnHub.</span>
          <Heart className="w-4 h-4 text-red-500" />
          <span>Built by Bonam Chandra Durga Gowri Shankar.</span>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
