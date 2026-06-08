/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Mail, 
  HelpCircle, 
  Phone, 
  Users, 
  Send, 
  CheckCircle2, 
  Info,
  ChevronDown,
  BookOpen,
  MapPin,
  LifeBuoy
} from "lucide-react";
import { Helpline } from "../types.js";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "Is my personal data safe, secured, and anonymous?",
    a: "Absolutely. TeenSphere is designed as a secure vault for your self-care. Your records, check-ins, and journals are saved privately on our server and are indexed purely to your custom anonymous avatar id. We use high-security hashing to guard profiles."
  },
  {
    q: "Can my parents or school administrators view my logs?",
    a: "No. Your logs, CBT worksheets, and journal thoughts are strictly confidential. We do not provide access dashboards to schools or parents. You are in complete custody of your private space."
  },
  {
    q: "Is the BuddyBot assistant a replacement for a doctor or licensed therapist?",
    a: "Definitely not. BuddyBot is a virtual peer companion trained to provide lifestyle tools, productivity advice, and relaxing breathing pacing. BuddyBot is NOT a medical mental health provider and cannot diagnose conditions or prescribe plans. If you are experiencing dangerous distress, please consult an adult or certified lifelines."
  },
  {
    q: "What should I do if I am in immediate severe distress?",
    a: "If you feel in severe distress, you are NOT alone and help is immediately accessible. Please contact our SOS resources below (Call/Text 988) or talk to a trusted adult, school counselor, or dial 911 immediately. You are handled with care!"
  },
  {
    q: "How can I earn wellness awards and Level-Up points?",
    a: "You earn wellness Experience Points (XP) for everything constructive you do on TeenSphere: 15 XP for daily mood check-ins, 25 XP for gratitude logs, 30 XP for challenging thoughts via the CBT reframer, and 15 XP for weekly challenges."
  }
];

export default function SupportCenter() {
  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const [loadingLines, setLoadingLines] = useState(true);

  // Forms States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticketError, setTicketError] = useState("");

  // FAQ collapse state helper
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    fetchHelplines();
  }, []);

  const fetchHelplines = async () => {
    try {
      const res = await fetch("/api/helplines");
      if (res.ok) {
        const data = await res.json();
        setHelplines(data.helplines || []);
      }
    } catch (e) {
      console.error("Failed to load active helplines list", e);
    } finally {
      setLoadingLines(false);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTicketError("");

    try {
      const res = await fetch("/api/support/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed sending ticket, retry!");

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setTicketSuccess(true);
    } catch (err: any) {
      setTicketError(err.message || "Unable to send contact form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="support-center-wrapper" className="space-y-12 py-8 px-4 md:px-8 max-w-7xl mx-auto font-sans">
      
      {/* 1. CRITICAL SAFETY DIRECTIVE PROMINENT BANNER (Emergency Disclaimers) */}
      <section id="safety-sos-banner" className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-red-950/40 border border-red-500/40 shadow-xl shadow-red-950/20 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <div className="absolute inset-0 bg-red-650 opacity-5 pointer-events-none" />
        
        <div className="space-y-2 flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-mono font-bold uppercase tracking-wider animate-pulse">
            <ShieldAlert className="w-4.5 h-4.5" /> Emergency Crisis Notice
          </div>
          <h2 className="font-display font-black text-xl md:text-2xl text-white">You Are Not Alone. We Are Here.</h2>
          <p className="text-xs md:text-sm text-gray-300 max-w-3xl leading-relaxed">
            If you are in immediate physical danger, struggling with severe suicide/self-harm thoughts, or in an abusive situation, please do not carry it alone. Seek help immediately! Speak to a trusted adult, a health professional, school counselor, or reach out to immediate services below.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 md:justify-end">
          <a 
            href="tel:988" 
            className="px-5 py-3 hover:cursor-pointer text-center text-sm font-extrabold bg-[#ef4444] hover:bg-red-500 text-white rounded-lg shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2 font-mono"
          >
            ☎ DIAL 1098 
          </a>
          <a 
            href="sms:741741?body=HOME" 
            className="px-5 py-3 hover:cursor-pointer text-center text-sm font-bold bg-white/10 hover:bg-white/15 text-gray-200 hover:text-white border border-white/10 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            💬 TEXT "HOME" TO 7867433356
          </a>
        </div>
      </section>

      {/* 2. ADULTS EXPLANATION ADVICE BOARD */}
      <section id="talking-to-adults-guide" className="p-6 md:p-8 rounded-2xl bg-glass border border-white/6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
          <BookOpen className="w-10 h-10 text-indigo-400 p-2 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mx-auto lg:mx-0" />
          <h3 className="font-display font-bold text-xl text-white">How to Talk to a Trusted Adult</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Opening up about stress or emotional chaos is extremely scary. We designed simple conversational frameworks to help you kickstart that chat smoothly.
          </p>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { tag: "Conversation Starter 1", label: "For School Counselor Advice", phrase: "'Hi Counselor, I'm feeling really swamped with grade expectations and it's starting to crash my sleep. Can you help me study plan or discuss accommodation options?'", bg: "bg-indigo-950/20 border-indigo-500/20" },
            { tag: "Conversation Starter 2", label: "For Explaining boundaries to Parents", phrase: "'Hey Mom/Dad, there is somethings causing pressure in my daily schedule. Can we sit down for 10 minutes when you're off-work so I can explain how I feel?'", bg: "bg-cyan-950/20 border-cyan-500/20" }
          ].map((item, idx) => (
            <div key={idx} className={`p-4.5 rounded-xl border ${item.bg} space-y-2`}>
              <span className="text-[9px] font-mono uppercase bg-black/30 px-1.5 py-0.5 rounded text-gray-400 font-bold border border-white/5">{item.tag}</span>
              <h4 className="text-xs font-bold text-white font-display mt-1">{item.label}</h4>
              <p className="text-xs text-gray-300 italic leading-relaxed pt-2 border-t border-white/5">&ldquo;{item.phrase}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORE COLUMNER LAYOUT: FAQs vs helpline DIRECTORIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* HELPLINES COLUMN DIRECTORY */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-display text-white">Validated Helpline Directory</h3>
            <p className="text-xs text-gray-400">Trusted, certified 24/7 resources dedicated to youth wellness across specific challenges.</p>
          </div>

          {loadingLines ? (
            <div className="py-10 text-center text-xs text-gray-500">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading live resources from TeenSphere databases...
            </div>
          ) : helplines.length === 0 ? (
            <p className="text-xs text-gray-500">No active resources registered under database.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {helplines.map((hl) => (
                <div key={hl.id} className="p-5 rounded-2xl bg-glass border border-white/5 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono font-bold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/10 px-2 py-0.5 rounded-full">
                      {hl.category}
                    </span>
                    <h4 className="text-xs font-bold text-white font-display">{hl.name}</h4>
                    <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">⏱ Hours: {hl.hours}</span>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-sans">{hl.description}</p>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                    <span className="text-xs font-bold font-mono text-[#5582A8]">{hl.number}</span>
                    <a 
                      href={`tel:${hl.number.replace(/\D/g, "")}`}
                      className="px-2.5 py-1 text-[10px] font-bold bg-[#5582A8]/10 text-[#5582A8] border border-[#5582A8]/20 hover:bg-[#5582A8]/20 rounded transition-colors"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONTROLLERS COLUMN: FAQ DICTIONARIES & FEEDBACK contact FORMS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* FAQ BLOCK AREA */}
          <div className="p-6 rounded-2xl bg-glass border border-white/6 space-y-4">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-1.5">
              <HelpCircle className="w-4.5 h-4.5 text-indigo-400" />
              Frequently Asked Questions
            </h3>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {FAQS.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="border-b border-white/5 pb-2 last:border-0">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center py-2.5 text-xs text-left font-bold text-gray-200 hover:text-white transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180 text-white" : ""}`} />
                    </button>
                    {isOpen && (
                      <p className="text-xs text-gray-400 leading-relaxed pb-2 pl-1 animate-in fade-in duration-150">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PRIVILEGED TICKETING FEEDBACK FORM */}
          <div className="p-6 rounded-2xl bg-glass border border-white/6 space-y-4">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-1.5">
              <Mail className="w-4.5 h-4.5 text-cyan-400" />
              Contact Our Support Crew
            </h3>

            <p className="text-[10px] text-gray-500">
              Have wellness inquiries or bulk school counselor coordination questions? Log a support ticket safely here.
            </p>

            {ticketSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/5 text-emerald-400 text-center space-y-2 border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold">Inquiry Sent Successfully!</p>
                <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
                  Our moderators will check your validation status and reply back within 24 business hours as requested.
                </p>
                <button 
                  onClick={() => setTicketSuccess(false)}
                  className="text-[10px] underline text-[#5582A8] mt-2 block mx-auto font-bold"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-3.5">
                {ticketError && (
                  <p className="text-xs text-red-400 bg-red-400/10 p-2 rounded">{ticketError}</p>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase font-mono font-bold tracking-wider mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sam"
                      className="w-full p-2.5 text-xs bg-black/25 border border-white/8 rounded-lg text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-500 uppercase font-mono font-bold tracking-wider mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sam@friend.com"
                      className="w-full p-2.5 text-xs bg-black/25 border border-white/8 rounded-lg text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-mono font-bold tracking-wider mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="E.g., High school wellness coordination"
                    className="w-full p-2.5 text-xs bg-black/25 border border-white/8 rounded-lg text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-mono font-bold tracking-wider mb-1">Detailed Message</label>
                  <textarea
                    required
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write details of your proposal or query. We respect fully your privacy requirements."
                    className="w-full p-2.5 text-xs bg-black/25 border border-white/8 rounded-lg text-white outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  {submitting ? "Forwarding..." : "Submit Inquiry Ticket"}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
