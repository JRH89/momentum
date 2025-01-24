"use client";

import { useState } from "react";
import { Header } from "./landing-page/Header";
import { Footer } from "./landing-page/Footer";
import { LoaderPinwheel, Mail } from "lucide-react";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setForm({ name: "", email: "", message: "" });
        toast.success("Message sent successfully!");
        setStatus("");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error || "Something went wrong."}`);
      }
    } catch (error) {
      toast.error("Error: Unable to send message.");
    }
  };

  return (
    <>
      <Header />

      <div className="max-w-xl w-full mx-auto p-6 min-h-screen h-full flex flex-col justify-center items-center pt-16">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Contact Us</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-col w-full"
        >
          <div className="flex flex-col w-full">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-2 border-black rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border-2 border-black rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              className="w-full border-2 border-black rounded-lg p-2"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-confirm text-black font-semibold py-2 px-4 rounded-lg hover:shadow-lg border-2 border-black hover:shadow-black transition duration-300 shadow-md shadow-black flex flex-row items-center  gap-2 w-full mx-auto justify-center"
          >
            {status ? (
              <p>
                <LoaderPinwheel className="w-7 h-7 animate-spin duration-300" />
              </p>
            ) : (
              <p className="flex flex-row items-center gap-2">
                {" "}
                <Mail className="w-7 h-7" />
                Send Message
              </p>
            )}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
