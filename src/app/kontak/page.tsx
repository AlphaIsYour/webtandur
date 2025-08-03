// src/app/kontak/page.tsx
"use client";

import React, { useState, FormEvent } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaInstagram,
  FaWhatsapp,
  FaFacebook,
} from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    console.log("Form Data Submitted:", formData);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const success = Math.random() > 0.2;

    if (success) {
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else {
      setSubmitStatus("error");
    }

    setIsSubmitting(false);
  };

  return (
    <div
      className="bg-gray-50 min-h-screen sm:w-full py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 mt-16"
      style={{ fontFamily: "mona-sans" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight"
            style={{ color: "oklch(58.7% 0.194 149.214)" }}
          >
            Hubungi Kami
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-6 text-gray-600 max-w-2xl mx-auto px-2">
            Punya pertanyaan, saran, atau butuh bantuan? Jangan ragu untuk
            menghubungi tim Tandur!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg">
          <div className="contact-info-section">
            <h2
              className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6"
              style={{ color: "oklch(58.7% 0.194 149.214)" }}
            >
              Informasi Kontak
            </h2>

            <div className="space-y-4 sm:space-y-6 text-gray-700">
              <div className="flex items-start space-x-3 sm:space-x-4 group">
                <FaMapMarkerAlt
                  className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 mt-1 group-hover:animate-bounce"
                  style={{ color: "oklch(58.7% 0.194 149.214)" }}
                />
                <div>
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                    Alamat Kami
                  </h3>
                  <p className="text-sm">
                    Jl. Kaliurang Barat No. 125, <br />
                    Kel. Samaan, Kec. Klojen, <br />
                    Kota Malang, Jawa Timur 65112
                  </p>
                  <a
                    href="https://maps.google.com/?q=Jl.+Kenangan+Mantan+No.+123,+Kota+Contoh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm  hover:text-green-600 hover:underline mt-1 inline-block"
                    style={{ color: "oklch(58.7% 0.194 149.214)" }}
                  >
                    Lihat di Peta
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4 group">
                <FaPhoneAlt className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 group-hover:animate-pulse" />
                <div>
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                    Telepon
                  </h3>
                  <a
                    href="tel:+6281331296965"
                    className="text-sm text-green-600 hover:text-green-600 hover:underline"
                  >
                    +62 813-3129-6965
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4 group">
                <FaEnvelope className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                    Email
                  </h3>
                  <a
                    href="mailto:webtandur@gmail.com"
                    className="text-sm text-green-500 hover:text-green-700 hover:underline break-all"
                  >
                    webtandur@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <FaClock className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                    Jam Operasional CS
                  </h3>
                  <p className="text-sm">
                    Senin - Jumat: 08:00 - 16:00 WIB <br />
                    Sabtu: 10:00 - 16:00 WIB <br />
                    (Minggu & Hari Libur Nasional Tutup)
                  </p>
                </div>
              </div>

              <div className="pt-2 sm:pt-4">
                <h3 className="font-medium text-green-600 mb-2 text-sm sm:text-base">
                  Temukan Kami di Media Sosial
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="https://instagram.com/webtandur.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-gray-500 hover:text-pink-600 transition-colors"
                  >
                    <FaInstagram className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                  <a
                    href="https://wa.me/6281331296965"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="text-gray-500 hover:text-green-500 transition-colors"
                  >
                    <FaWhatsapp className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                  <a
                    href="https://facebook.com/webtandur.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-gray-500 hover:text-blue-700 transition-colors"
                  >
                    <FaFacebook className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-10">
              <h3 className="font-medium text-green-600 mb-3 text-sm sm:text-base">
                Lokasi Kami
              </h3>
              <div className="rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d8787.6052447585!2d112.62423985498225!3d-7.954472142073712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1748359934556!5m2!1sen!2sid"
                  width="100%"
                  height="250"
                  className="sm:h-80"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi Tandur"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-600 mb-4 sm:mb-6">
              Kirim Pesan Langsung
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green=500 focus:border-green=500 transition duration-150 ease-in-out text-sm sm:text-base"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Alamat Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green=500 focus:border-green=500 transition duration-150 ease-in-out text-sm sm:text-base"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subjek Pesan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green=500 focus:border-green=500 transition duration-150 ease-in-out text-sm sm:text-base"
                  placeholder="Pertanyaan tentang produk..."
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Isi Pesan <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green=500 focus:border-green=500 transition duration-150 ease-in-out text-sm sm:text-base resize-none"
                  placeholder="Tuliskan pesan Anda di sini..."
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 focus:ring-green-500"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      Kirim Pesan
                      <FaPaperPlane className="ml-2 -mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                    </>
                  )}
                </button>
              </div>

              {submitStatus === "success" && (
                <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-300">
                  <p className="text-sm font-medium text-green-800">
                    Pesan berhasil terkirim! Kami akan segera menghubungi Anda.
                  </p>
                </div>
              )}
              {submitStatus === "error" && (
                <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-300">
                  <p className="text-sm font-medium text-red-800">
                    Gagal mengirim pesan. Silakan coba lagi atau hubungi kami
                    via metode lain.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
