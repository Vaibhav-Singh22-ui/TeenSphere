/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Sparkles, 
  Heart, 
  Activity, 
  ShieldCheck, 
  Lock, 
  MessageSquare,
  Compass, 
  Flame, 
  Users, 
  Smile, 
  ArrowRight,
  PlusSquare,
  Award
} from "lucide-react";

interface HomeViewProps {
  currentUser: any;
  setTab: (tab: string) => void;
  openAuthModal: () => void;
}

export default function HomeView({ currentUser, setTab, openAuthModal }: HomeViewProps) {
  return (
    <div id="home-view-container" className="space-y-16 py-8 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* 1. HERO SECTION */}
      <section id="home-hero" className="relative flex flex-col lg:flex-row items-center gap-12 pt-4 md:pt-12">
        {/* Glow Sphere backdrops */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#6B4FA0]/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#5582A8]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Text Area */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[#a5b4fc] text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-[#5582A8]" />
            Created for Teens, by Teens
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
            Your Safe Space for <br />
            <span className="bg-gradient-to-r from-indigo-400 via-[#5582A8] to-indigo-300 bg-clip-text text-transparent">
              Growth, Confidence,
            </span> <br />
            and Mental Wellness.
          </h1>

          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
            Helping teenagers navigate emotions, friendships, school pressure, confidence, and everyday challenges.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            {currentUser ? (
              <button
                id="hero-go-dashboard"
                onClick={() => setTab("dashboard")}
                className="hover:cursor-pointer flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-indigo-900/30 transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="hero-join-now"
                onClick={openAuthModal}
                className="hover:cursor-pointer flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-indigo-900/30 transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                Create Custom Avatar
                <PlusSquare className="w-4 h-4" />
              </button>
            )}

            <button
              id="hero-see-guides"
              onClick={() => setTab("guidance")}
              className="hover:cursor-pointer flex items-center justify-center gap-2 px-6 py-3 font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            >
              Explore Guidance Library
              <Compass className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-mono text-gray-500 pt-4 border-t border-white/5">
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-indigo-400" /> Fully Private Logs</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#5582A8]" /> Trusted Helpline Support</span>
            <span className="flex items-center gap-1.5"><Smile className="w-3.5 h-3.5 text-amber-500" /> Supportive peer guidance</span>
          </div>
        </div>

        {/* Interactive Visual Card Layer (Looks extremely premium SaaS) */}
        <div id="hero-feature-board" className="flex-1 w-full max-w-lg lg:max-w-none relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur-2xl opacity-10" />
          
          <div className="relative p-6 rounded-2xl bg-glass border border-white/10 shadow-2xl space-y-6">
            
            {/* Simulated Live check-in */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/25 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <h4 className="text-xs font-bold text-white">Daily Wellness Vibe Check</h4>
                  <p className="text-[10px] text-gray-500">Log mood to unlock custom affirmations</p>
                </div>
              </div>
              <button 
                onClick={() => currentUser ? setTab("mood") : openAuthModal()}
                className="px-2.5 py-1 text-[11px] font-bold bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 rounded border border-indigo-500/30 transition-colors"
              >
                Log Now
              </button>
            </div>

            {/* Breathing Bubble preview */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#172554] to-[#083344] border border-[#1e40af]/20">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-[#5582A8] flex items-center justify-center breathe-box">
                <Smile className="w-5 h-5 fill-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#e0f2fe]">Calm Down Activity</span>
                  <span className="text-[10px] bg-cyan-900/40 text-cyan-400 px-1.5 py-0.5 rounded font-mono font-bold">+15 XP</span>
                </div>
                <h3 className="text-sm font-semibold text-white mt-0.5">Box Breathing (4-4-4-4)</h3>
                <p className="text-[11px] text-gray-400 mt-1 leading-snug">Relax your nervous system by coordinating with visual loops.</p>
              </div>
            </div>

            {/* AI Assistant teaser panel */}
            <div className="p-4 rounded-xl bg-black/35 border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-gray-400 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#5582A8]" /> BuddyBot AI Helper
                </span>
                <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>
              </div>
              <p className="text-xs italic text-gray-300 leading-normal">
                &ldquo;Hey! High school can be chaotic. Let's draft a relaxing step-by-step breaks schedule for tonight&rsquo;s exam prep so you don't feel overloaded.&rdquo;
              </p>
              <div className="flex justify-end">
                <button 
                  onClick={() => currentUser ? setTab("dashboard") : openAuthModal()}
                  className="text-xs text-[#5582A8] hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  Start Supportive Chat <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS SECTION (Premium Metric Blocks) */}
      <section id="home-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: Users, val: "220k+", title: "Active Teen Members", desc: "Anonymously supporting each other", color: "text-indigo-400" },
          { icon: SmileyFaceIcon, val: "1.2M+", title: "Vibe Logs Checked", desc: "Understanding mental health patterns", color: "text-[#5582A8]" },
          { icon: Flame, val: "5-Day Avg", title: "Activity Streak Goals", desc: "Gamified reward tracking structures", color: "text-yellow-400" },
          { icon: Award, val: "94.6%", title: "Wellness Progress Rate", desc: "Reporting higher school resilience", color: "text-emerald-400" }
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-glass border border-white/6 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-gray-500">Metric Log 0{i+1}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <h3 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">{stat.val}</h3>
              <p className="text-xs font-bold text-gray-300 mt-1">{stat.title}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{stat.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 3. BENTO GRID FEATURES SHOWCASE */}
      <section id="home-features" className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-2xl md:text-4xl text-white">How TeenSphere Helps You Lead</h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Interactive, customizable toolboxes designed directly to match your mood, academic scheduling, or friendship states.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Problems Page preview */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-glass border border-white/6 hover:border-white/10 transition-colors flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono bg-indigo-500/10 text-[#a5b4fc] px-2 py-1 rounded border border-indigo-500/10 uppercase tracking-widest font-bold">Solutions Hub</span>
              <h3 className="text-xl font-bold text-white font-display">Targeted Problem-Solving Resource Library</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Step-by-step cognitive reappraisal frameworks to address exam anxiety, friendship drama, cyberbullying, screen time dependencies, and family conflict resolution. Each course includes practical checklists to practice resilience.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Academic Stress", "Exam Anxiety", "Bullying Protection", "Confidence Booster", "Conflicts Repair"].map((cat, idx) => (
                <span key={idx} className="px-2.5 py-1 text-xs bg-black/25 text-indigo-300 border border-white/5 rounded-lg font-medium">{cat}</span>
              ))}
            </div>
            <button 
              onClick={() => setTab("guidance")} 
              className="w-full sm:w-auto self-start px-4 py-2 hover:cursor-pointer hover:bg-indigo-500/20 text-[#a5b4fc] border border-indigo-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              Consult Solutions Library <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Support Circle */}
          <div className="p-6 rounded-2xl bg-glass border border-[#ce4b4b]/20 hover:border-[#ce4b4b]/30 transition-colors flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono bg-[#ef4444]/10 text-[#ef4444] px-2 py-1 rounded border border-[#ef4444]/15 uppercase tracking-widest font-bold">SOS Gateway</span>
              <h3 className="text-xl font-bold text-white font-display">Validated Helpline & Immediate Support directories</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Emergency 988 connections, chat guidelines, parenting manuals, and access to peer counseling formats. Includes direct instructions on how to start conversations with trusted guardians or school counselors.
              </p>
            </div>
            <button 
              onClick={() => setTab("support")} 
              className="w-full px-4 py-2 hover:cursor-pointer bg-red-600/15 hover:bg-red-600/25 text-red-300 border border-red-500/35 rounded-xl text-xs font-bold transition-all text-center"
            >
              Get Hotlines Guide
            </button>
          </div>

          {/* Card 3: Mood log description */}
          <div className="p-6 rounded-2xl bg-glass border border-white/6 hover:border-white/10 transition-colors flex flex-col justify-between space-y-4">
            <Smile className="w-8 h-8 text-[#5582A8] bg-[#5582A8]/10 p-1.5 rounded-xl border border-[#5582A8]/20" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Interactive Mood Check Center</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Log daily feelings, catalog corresponding stressors, identify lifestyle patterns, and watch automatic analytics map your historical resilience.
              </p>
            </div>
            <button onClick={() => currentUser ? setTab("mood") : openAuthModal()} className="text-xs text-[#5582A8] hover:underline font-bold flex items-center gap-0.5">Explore Vibe Tracking <ArrowRight className="w-3" /></button>
          </div>

          {/* Card 4: Daily Reflection description */}
          <div className="p-6 rounded-2xl bg-glass border border-white/6 hover:border-white/10 transition-colors flex flex-col justify-between space-y-4">
            <Activity className="w-8 h-8 text-indigo-400 bg-indigo-400/10 p-1.5 rounded-xl border border-indigo-400/20" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Gamified Activities Hub & Gratitude Logs</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Earn XP, check-in daily streaks, generate customized positive affirmation cards, write down gratitude reminders, or coordinate standard calm breathing rhythms.
              </p>
            </div>
            <button onClick={() => currentUser ? setTab("activities") : openAuthModal()} className="text-xs text-indigo-400 hover:underline font-bold flex items-center gap-0.5">Start Activities <ArrowRight className="w-3" /></button>
          </div>

          {/* Card 5: Safe AI buddy Bot */}
          <div className="p-6 rounded-2xl bg-glass border border-white/6 hover:border-white/10 transition-colors flex flex-col justify-between space-y-4">
            <MessageSquare className="w-8 h-8 text-yellow-500 bg-yellow-500/10 p-1.5 rounded-xl border border-yellow-500/20" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Compassionate BuddyBot Companion</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Stressed about quizzes, social situations, or procrastination? Discuss productivity tips or request tailored daily challenges from our supportive AI helper.
              </p>
            </div>
            <button onClick={() => currentUser ? setTab("dashboard") : openAuthModal()} className="text-xs text-yellow-400 hover:underline font-bold flex items-center gap-0.5">Open Companion Chat <ArrowRight className="w-3" /></button>
          </div>
        </div>
      </section>

      {/* 4. TRUE TEEN TESTIMONIALS (Dicebear Avatars for high quality design) */}
      <section id="home-reviews" className="space-y-8">
        <div className="text-center space-y-1">
          <h2 className="font-display font-bold text-xl md:text-3xl text-indigo-300">Reviewed By Real Teenagers</h2>
          <p className="text-xs text-gray-400">Read what members of our community are experiencing anonymously.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "S_Chilled17", age: 16, text: "The Box Breathing loop and Gratitude log has been a lifesaver during exams week. I earned enough XP to get Level 3 and it genuinely keeps me checking in everyday.", seed: "Sam" },
            { name: "Elena_Vibes", age: 15, text: "BuddyBot doesn't judge me. Sitting down and explaining my school anxiety to BuddyBot helped me realize that everyone's going through some pressure.", seed: "Elena" },
            { name: "Justin_Focus", age: 18, text: "The Solutions Guidance on Family conflicts actually gave me concrete steps on how to explain my boundary requirements to my dad without getting defensive.", seed: "Jordan" }
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-glass border border-white/5 space-y-4 relative">
              <p className="text-xs text-gray-300 leading-relaxed italic">&ldquo;{item.text}&rdquo;</p>
              <div className="flex items-center gap-2.5 pt-2 border-t border-white/5">
                <img 
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${item.seed}`} 
                  alt={item.name} 
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full bg-[#1e2030] border border-indigo-500/25"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                  <p className="text-[10px] text-gray-500">Age {item.age} • Wellness Level {idx + 2}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION CONTAINER */}
      <section id="home-cta" className="p-8 md:p-12 rounded-3xl bg-gradient-to-tr from-[#1b194d] via-[#111827] to-[#0d2a35] border border-white/10 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white opacity-5" />
        <h2 className="font-display font-black text-2xl md:text-4xl text-white">Ready to take control of your vibes?</h2>
        <p className="text-xs md:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
          Create an anonymous custom teen avatar, track your mood trends, complete interesting confidence-building games, and learn positive stress-handling habits safely.
        </p>
        <div className="pt-2">
          {currentUser ? (
            <button
              onClick={() => setTab("dashboard")}
              className="px-8 py-3.5 hover:cursor-pointer font-bold text-sm bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-white rounded-xl shadow-lg shadow-indigo-900/40 transition-transform active:scale-[0.98]"
            >
              Enter Your Personal Lounge
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-8 py-3.5 hover:cursor-pointer font-bold text-sm bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-white rounded-xl shadow-lg shadow-indigo-900/40 transition-transform active:scale-[0.98]"
            >
              Get Started • Free & Anonymous
            </button>
          )}
        </div>
      </section>

    </div>
  );
}

// Simple custom Lucide Smile SVG variant
function SmileyFaceIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}
