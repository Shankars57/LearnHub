import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-hot-toast";
import { Mail, Phone, MapPin, Send, Heart } from "lucide-react";

const ContactPage = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("service_acz2rvi", "template_7ofk82r", form.current, {
        publicKey: "TXN1gH5hEouwIyjVO",
      })
      .then(
        () => {
          toast.success("Message sent successfully!");
          form.current.reset();
        },
        () => {
          toast.error("Failed to send message. Please try again.");
        }
      );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center py-20 px-6 md:px-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
          Get in Touch
        </h1>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
          Whether you;ve got a question about LearnHub, want to collaborate, or
          just want to say hi — drop us a message. We'll get back to you soon.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8 mb-20">
        <div className="flex items-center gap-3 text-gray-300">
          <Mail className="text-cyan-400" size={22} />
          <p className="text-sm md:text-base">bonamgshankar@gmail.com</p>
        </div>
        <div className="hidden md:block h-6 w-px bg-gray-700" />
        <div className="flex items-center gap-3 text-gray-300 mt-6 md:mt-0">
          <Phone className="text-green-400" size={22} />
          <p className="text-sm md:text-base">+91 9110560147</p>
        </div>
        <div className="hidden md:block h-6 w-px bg-gray-700" />
        <div className="flex items-center gap-3 text-gray-300 mt-6 md:mt-0">
          <MapPin className="text-red-400" size={22} />
          <p className="text-sm md:text-base">
            Peddapuram, Andhra Pradesh, India
          </p>
        </div>
      </div>

      <form
        ref={form}
        onSubmit={sendEmail}
        className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-cyan-400">
          Send a Message
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-400">
              Your Name
            </label>
            <input
              type="text"
              name="from_name"
              placeholder="ex: John"
              required
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">
              Your Email
            </label>
            <input
              type="email"
              name="reply_to"
              required
              placeholder="ex: example@gmail.com"
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Message</label>
            <textarea
              name="message"
              rows="5"
              required
              placeholder="Tell what you want?"
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200 resize-none"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 mt-8 py-3 font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all rounded-lg text-white"
        >
          <Send size={18} />
          Send Message
        </button>
      </form>

      <div className="mt-16 text-center text-gray-500 text-sm flex items-center gap-2">
        © {new Date().getFullYear()} LearnHub. Built with
        <Heart className="text-red-500 w-4 h-4" />
        by Bonam Chandra Durga Gowri Shankar
      </div>
    </div>
  );
};

export default ContactPage;
