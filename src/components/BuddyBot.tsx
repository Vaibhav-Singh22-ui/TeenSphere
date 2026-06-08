/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Send, 
  X, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Heart, 
  Frown,
  Activity,
  Smile,
  ShieldCheck
} from "lucide-react";
import { User, ChatMessage } from "../types.js";

interface BuddyBotProps {
  currentUser: User | null;
  openAuthModal: () => void;
}

const CONVO_CHIPS = [
  { label: "Stressed about exam 📝", text: "Hi BuddyBot, I'm feeling super anxious about my board exams coming up in two weeks. I can't seem to focus." },
  { label: "Friendship drama 💔", text: "Hey! I felt left out by my friend group today at lunch. It really hurt. How can I cope?" },
  { label: "Procrastination trap 🥱", text: "I have a chemistry paper due tonight but I've been doomscrolling for hours. Help me start!" },
  { label: "Boundary with parents 🏡", text: "I want to explain to my parents that I need alone time after school without getting into arguments." }
];

export default function BuddyBot({ currentUser, openAuthModal }: BuddyBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize companion with welcoming intro
  useEffect(() => {
    setMessages([
      {
        id: "wel_01",
        role: "model",
        text: "Hey! I'm BuddyBot, your safe digital companion. 🌟 High school can be highly chaotic. Stressed about a quiz, friendship drama, or procrastination? Let's talk or click any prompt below. I'm completely anonymous!",
        createdAt: new Date().toISOString()
      }
    ]);
  }, []);

  // Soft scroll to bottom on message add
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typing]);

  const sendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    if (!currentUser) {
      openAuthModal();
      return;
    }

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      text: textToSend,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setTyping(true);

    try {
      // Connect to full-stack Express server endpoints proxying Gemini
      const res = await fetch("/api/buddy/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.id}`
        },
        body: JSON.stringify({ message: textToSend })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const buddyMsg: ChatMessage = {
        id: `b_${Date.now()}`,
        role: "model",
        text: data.reply,
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, buddyMsg]);
    } catch (e) {
      console.error(e);
      // Clean fallback if API fails
      const fallbackReply = `Hey! I hear you, and those feelings are completely valid. Balancing exams, friendship boundaries, and family expectations is tough. Let's practice 3 minutes of Box Breathing together click on the Activities tab to relieve this immediate nervous tension!`;
      
      setMessages((prev) => [...prev, {
        id: `b_err_${Date.now()}`,
        role: "model",
        text: fallbackReply,
        createdAt: new Date().toISOString()
      }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div id="buddybot-widget" className="fixed bottom-6 right-6 z-40 font-sans">
      
      {/* COLLAPSED FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="hover:cursor-pointer flex items-center gap-2.5 px-5 py-4 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-[#5582A8] text-white hover:from-indigo-500 hover:to-cyan-400 shadow-2xl shadow-indigo-950/40 hover:scale-[1.03] transition-all border border-white/15 animate-bounce-subtle"
        >
          <div className="relative">
            <MessageSquare className="w-5.5 h-5.5" />
            <span className="absolute -top-1.5 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-indigo-600 animate-ping" />
          </div>
          <span className="text-xs font-black tracking-wide uppercase">Support BuddyBot</span>
        </button>
      )}

      {/* CHAT WINDOW BOX */}
      {isOpen && (
        <div className="w-[325px] sm:w-[380px] h-[480px] rounded-3xl bg-[#0c0e18]/95 border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom-4 duration-200 backdrop-blur-xl">
          
          {/* HEADER BAR */}
          <div className="p-4 bg-gradient-to-r from-indigo-950 via-[#111827] to-cyan-950/45 border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl bg-[#5582A8]/10 w-9 h-9 rounded-xl border border-[#5582A8]/25 flex items-center justify-center animate-pulse">🤖</span>
              <div>
                <h3 className="text-xs font-extrabold text-white flex items-center gap-1">
                  BuddyBot Companion
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </h3>
                <span className="text-[10px] text-gray-500 font-mono">Secure AI Empathy Core</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MESSAGE VIEW AREA */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m) => {
              const isBuddy = m.role === "model";
              return (
                <div 
                  key={m.id} 
                  className={`flex gap-2.5 items-start max-w-[85%] ${isBuddy ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  {isBuddy && <span className="text-xl bg-black/20 p-1 rounded-lg">🤖</span>}
                  
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isBuddy 
                      ? "bg-white/5 text-gray-200 border border-white/6 rounded-tl-none font-sans" 
                      : "bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-tr-none font-sans"
                  }`}>
                    {m.text}
                    <span className="block text-[9px] text-gray-550 mt-1 font-mono text-right">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Micro Typing Indicators Bubble */}
            {typing && (
              <div className="flex gap-2 items-center mr-auto max-w-[80%] animate-pulse">
                <span className="text-lg">🤖</span>
                <div className="p-3 bg-white/5 rounded-2xl rounded-tl-none border border-white/8 text-xs text-gray-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-200" />
                  <span className="text-[10px] text-gray-500 font-mono">BuddyBot is drafting ideas...</span>
                </div>
              </div>
            )}
            
            <div ref={bottomRef} />
          </div>

          {/* DOCK CHIPS SELECTOR BAR (Before inputs) */}
          {messages.length < 4 && (
            <div className="px-4 pb-2 pt-1 border-t border-white/5 bg-black/15">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono block mb-1.5">Quick help prompts:</span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CONVO_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendMessage(chip.text)}
                    className="hover:cursor-pointer shrink-0 text-[10px] font-bold bg-[#1e1b4b]/30 hover:bg-[#1e1b4b]/60 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-lg transition-all"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* INPUT FORMS BOTTOM BAR */}
          <div className="p-3.5 bg-black/45 border-t border-white/6 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={currentUser ? "Ask anything about stress or habits..." : "Sign up or login to chat..."}
              disabled={!currentUser}
              className="flex-1 px-3 py-2 text-xs bg-[#111827]/40 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500"
            />
            
            {currentUser ? (
              <button
                onClick={() => sendMessage()}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center shrink-0"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-2.5 py-1 text-[10px] font-bold bg-indigo-500/20 text-[#a5b4fc] border border-indigo-500/30 rounded-xl hover:bg-indigo-500/30 whitespace-nowrap"
              >
                Authenticate
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
