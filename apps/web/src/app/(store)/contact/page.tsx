'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { Mail, Phone, MapPin, Clock, MessageSquare, Check, Sparkles, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#F8F1E7] text-[#0B0B0B] py-12 sm:py-16">
      <Container>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UNSULID® Concierge</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0B0B0B] tracking-tight mb-4">
            Connect With{' '}
            <span className="text-[#5B0F18] font-normal">Our Atelier</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#7A6E64] leading-relaxed">
            Have questions regarding olfactory notes, custom gifting sets, or order delivery? Our perfume concierge team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6D9C9] shadow-sm">
              <h2 className="font-serif text-xl sm:text-2xl text-[#0B0B0B] font-normal mb-6">
                Concierge Coordinates
              </h2>

              <ul className="space-y-6 text-xs sm:text-sm font-sans">
                <li className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#F8F1E7] text-[#5B0F18] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#0B0B0B] block text-xs uppercase tracking-wider mb-0.5 font-semibold">
                      Email Concierge
                    </strong>
                    <a
                      href="mailto:concierge@unsulid.com"
                      className="text-[#5B0F18] hover:underline"
                    >
                      concierge@unsulid.com
                    </a>
                    <span className="block text-[11px] text-[#7A6E64] mt-0.5">
                      Response within 4–6 business hours
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#F8F1E7] text-[#5B0F18] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#0B0B0B] block text-xs uppercase tracking-wider mb-0.5 font-semibold">
                      Direct &amp; WhatsApp
                    </strong>
                    <span className="text-[#0B0B0B]">+91 98765 43210</span>
                    <span className="block text-[11px] text-[#7A6E64] mt-0.5">
                      Monday to Saturday • 10:00 AM – 7:00 PM IST
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#F8F1E7] text-[#5B0F18] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#0B0B0B] block text-xs uppercase tracking-wider mb-0.5 font-semibold">
                      Surat Atelier &amp; Dispatch Hub
                    </strong>
                    <address className="not-italic text-xs text-[#7A6E64] leading-relaxed">
                      UNSULID Fine Fragrances Atelier<br />
                      Ring Road Logistics Zone, Surat, Gujarat 395002<br />
                      India
                    </address>
                  </div>
                </li>
              </ul>
            </div>

            {/* Tracking Shortcut */}
            <div className="bg-[#460910] text-white rounded-3xl p-6 sm:p-7 shadow-sm">
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block mb-2">
                Order Status
              </span>
              <h3 className="font-serif text-lg font-normal mb-2">
                Tracking an Existing Order?
              </h3>
              <p className="text-xs text-white/80 leading-relaxed mb-4 font-sans">
                Enter your order number (<span className="font-mono text-[#C6A15B]">UNS-2026-XXXX</span>) to check live Shiprocket Surat dispatch timeline.
              </p>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#F8F1E7] hover:text-[#C6A15B] transition-colors"
              >
                <span>Go to Order Tracking Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6D9C9] shadow-sm">
              <h2 className="font-serif text-2xl text-[#0B0B0B] font-normal mb-2">
                Send a Confidential Inquiry
              </h2>
              <p className="text-xs sm:text-sm font-sans text-[#7A6E64] mb-8">
                Fill out the details below and an olfactory specialist will contact you shortly.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h3 className="font-serif text-2xl text-emerald-950 font-normal mb-2">
                    Message Received
                  </h3>
                  <p className="text-xs sm:text-sm font-sans text-emerald-800 leading-relaxed max-w-md mx-auto mb-6">
                    Thank you, {form.name}. Your inquiry has been routed to our concierge desk. We will reach back via {form.email} or phone shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: '',
                        email: '',
                        phone: '',
                        subject: 'General Inquiry',
                        message: '',
                      });
                    }}
                    className="px-6 py-2 rounded-full bg-emerald-800 text-white text-xs font-sans font-semibold hover:bg-emerald-900 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-sans font-semibold text-[#0B0B0B] uppercase tracking-wider mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-4 py-2.5 text-xs font-sans text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans font-semibold text-[#0B0B0B] uppercase tracking-wider mb-2">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-4 py-2.5 text-xs font-sans text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-semibold text-[#0B0B0B] uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. rajesh@example.com"
                      className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-4 py-2.5 text-xs font-sans text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-semibold text-[#0B0B0B] uppercase tracking-wider mb-2">
                      Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-4 py-2.5 text-xs font-sans text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18] focus:bg-white"
                    >
                      <option value="General Inquiry">General Olfactory Inquiry</option>
                      <option value="Product Recommendation">Perfume Recommendation (Day vs Night)</option>
                      <option value="Order & Tracking">Order &amp; Surat Tracking Question</option>
                      <option value="Corporate & Wedding Gifting">Corporate &amp; Wedding Gifting</option>
                      <option value="The Private Vault">The Private Vault Waitlist</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-semibold text-[#0B0B0B] uppercase tracking-wider mb-2">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us what you would like to know about UNSULID fragrances..."
                      className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl p-4 text-xs font-sans text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18] focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#5B0F18] text-[#F8F1E7] text-xs font-sans font-semibold hover:bg-[#741522] transition-colors shadow-sm inline-flex items-center justify-center gap-2"
                  >
                    <span>Transmit Inquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
