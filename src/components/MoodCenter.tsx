/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Smile, 
  SmilePlus, 
  Meh, 
  Frown, 
  HeartCrack, 
  Calendar, 
  ListTodo, 
  TrendingUp, 
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { MoodEntry, User } from "../types.js";

interface MoodCenterProps {
  currentUser: User | null;
  onCheckInCompleted: (updatedUser: any) => void;
}

const CONST_EMOTIONS = [
  { id: "stressed", label: "Stressed 😰", val: -1 },
  { id: "anxious", label: "Anxious 😟", val: -1 },
  { id: "overwhelmed", label: "Overwhelmed 🤯", val: -2 },
  { id: "tired", label: "Tired 🥱", val: -1 },
  { id: "sad", label: "Sad 😢", val: -2 },
  { id: "neutral", label: "Just Okay 😐", val: 0 },
  { id: "peaceful", label: "Peaceful 🧘", val: 1 },
  { id: "proud", label: "Proud 😏", val: 2 },
  { id: "happy", label: "Happy 😄", val: 2 },
  { id: "excited", label: "Excited 🤩", val: 2 },
];

const CONST_ACTIVITIES = [
  { id: "exercised", label: "Exercised 🏃‍♂️" },
  { id: "journaled", label: "Journaled ✍️" },
  { id: "listened_music", label: "Music Beats 🎧" },
  { id: "slept_well", label: "Good Sleep 😴" },
  { id: "talked_friends", label: "Chatted Friends 🗣️" },
  { id: "studied", label: "Studied Hard 📚" },
  { id: "gaming", label: "Gaming Chill 🎮" },
  { id: "outdoors", label: "Outdoor Fresh Air 🌳" },
];

export default function MoodCenter({ currentUser, onCheckInCompleted }: MoodCenterProps) {
  const [moodValue, setMoodValue] = useState<number>(4);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [currentUser]);

  const fetchHistory = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/moods", {
        headers: { "Authorization": `Bearer ${currentUser.id}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.entries || []);
      }
    } catch (e) {
      console.error("Failed to load mood history timeline", e);
    }
  };

  const handleEmotionToggle = (id: string) => {
    if (selectedEmotions.includes(id)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== id));
    } else {
      setSelectedEmotions([...selectedEmotions, id]);
    }
  };

  const handleActivityToggle = (id: string) => {
    if (selectedActivities.includes(id)) {
      setSelectedActivities(selectedActivities.filter(a => a !== id));
    } else {
      setSelectedActivities([...selectedActivities, id]);
    }
  };

  const handleMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setErrorMsg("");
    setLoading(true);

    if (selectedEmotions.length === 0) {
      setErrorMsg("Please select at least one core feeling option.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/moods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.id}`
        },
        body: JSON.stringify({
          moodValue,
          emotions: selectedEmotions,
          activities: selectedActivities,
          notes
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed checking mood, retry!");
      }

      // Complete feedback mapping depending on logged mood
      const replies: Record<number, string> = {
        1: "I am so sorry things feel Awful. Be incredibly gentle with yourself today. Remember that physical help is always avaliable in the Help tab or from trusted adult supports.",
        2: "Things feel really rough. It's totally okay to feel down or tired. Try pausing with our Box Breathing activity and stepping away from screens.",
        3: "A neutral vibe today, and that is completely fine. Steady days are an important breathing space! Keep hydrated and take pride in minor habits.",
        4: "Glad you are having a Good day! Celebrate your minor wins and don't forget to keep tracking streaks to earn medals.",
        5: "Amazing! We are super happy you are experiencing an Excellent vibe. Write this moment down of gratitude in your Gratitude Journal to keep as anchor!"
      };

      setFeedback(replies[moodValue] || "Vibe logged! Proud of you for checking-in.");
      
      // Clear current check-in inputs
      setSelectedEmotions([]);
      setSelectedActivities([]);
      setNotes("");
      
      // Call prop callback to update XP levels and trigger refresh
      onCheckInCompleted(data.user);
      fetchHistory();
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong during check-in.");
    } finally {
      setLoading(false);
    }
  };

  // Render Premium custom SVG chart representing historical mood trend
  const renderInteractiveChart = () => {
    if (history.length < 2) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center bg-black/25 rounded-2xl border border-white/5">
          <Calendar className="w-10 h-10 text-gray-600 mb-2" />
          <p className="text-xs text-gray-500 max-w-xs">
            Log your mood at least twice to enable the custom SVG trend charts. Let's record a check-in!
          </p>
        </div>
      );
    }

    // Capture last 7 items, ascending order for timeline
    const chartData = [...history].slice(0, 7).reverse();
    const width = 500;
    const height = 150;
    const padding = 25;

    // Calculate coordinates
    const points = chartData.map((d, index) => {
      const x = padding + (index * (width - padding * 2)) / (chartData.length - 1);
      // Mood score is 1-5, scale to fit height
      const y = height - padding - ((d.moodValue - 1) * (height - padding * 2)) / 4;
      return { x, y, val: d.moodValue, date: new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
    });

    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath = `${linePath} L ${points[points.length-1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
      <div className="bg-black/35 rounded-2xl border border-white/6 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-widest">Aesthetic Mood Resonance (Last 7 logs)</span>
          <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Trend line
          </span>
        </div>

        {/* Responsive SVGs container */}
        <div className="relative w-full aspect-[5/1.5] overflow-visible">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
            <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5582A8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#6B4FA0" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 1, 2, 3, 4].map((gridIdx) => {
              const y = padding + (gridIdx * (height - padding * 2)) / 4;
              return (
                <line 
                  key={gridIdx} 
                  x1={padding} 
                  y1={y} 
                  x2={width - padding} 
                  y2={y} 
                  stroke="rgba(255,255,255,0.04)" 
                  strokeDasharray="4 4" 
                />
              );
            })}

            {/* Area path */}
            <path d={areaPath} fill="url(#chart-area-grad)" />

            {/* Trend Line */}
            <path d={linePath} fill="none" stroke="url(#line-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6B4FA0" />
              <stop offset="100%" stopColor="#5582A8" />
            </linearGradient>

            {/* Glowing Points and Tooltips */}
            {points.map((p, idx) => (
              <g key={idx} className="group/dot cursor-pointer">
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="5" 
                  fill="#5582A8" 
                  stroke="#0f1021" 
                  strokeWidth="2" 
                />
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="10" 
                  fill="transparent" 
                  className="hover:fill-[#5582A8]/20 transition-all" 
                />
                
                {/* Micro info on nodes details representation */}
                <text 
                  x={p.x} 
                  y={height - 6} 
                  textAnchor="middle" 
                  fill="#64748b" 
                  fontSize="8" 
                  fontFamily="monospace"
                >
                  {p.date}
                </text>

                <text 
                  x={p.x} 
                  y={p.y - 12} 
                  textAnchor="middle" 
                  fill="#ffffff" 
                  fontSize="9" 
                  fontWeight="bold" 
                  fontFamily="monospace"
                  className="opacity-0 group-hover/dot:opacity-100 transition-opacity bg-black duration-150"
                >
                  Vibe {p.val}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  const getMoodFaceEmoji = (val: number) => {
    switch (val) {
      case 1: return <HeartCrack className="w-6 h-6 text-red-400" />;
      case 2: return <Frown className="w-6 h-6 text-amber-400" />;
      case 3: return <Meh className="w-6 h-6 text-[#cbd5e1]" />;
      case 4: return <Smile className="w-6 h-6 text-[#5582A8]" />;
      case 5: return <SmilePlus className="w-6 h-6 text-emerald-400" />;
      default: return <Smile className="w-6 h-6 text-indigo-400" />;
    }
  };

  const getMoodString = (val: number) => {
    switch (val) {
      case 1: return "Awful 💔";
      case 2: return "Bad ⛈️";
      case 3: return "Meh/Okay ☁️";
      case 4: return "Good ✨";
      case 5: return "Excellent 🚀";
      default: return "Fine";
    }
  };

  return (
    <div id="mood-center-wrapper" className="space-y-12 py-8 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* 1. SECTION TITLES */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/15 text-xs font-mono">
          <TrendingUp className="w-4 h-4 text-[#5582A8]" />
          Teen Mood Check-In Center
        </div>
        <h1 className="font-display font-black text-3xl md:text-5xl text-white">How is Your Overall Vibe?</h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          Anonymously log how you feel, track stress patterns, and build habits with actionable positive guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CHECK-IN FORM PANEL */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 md:p-8 rounded-2xl bg-glass border border-white/6 space-y-6 relative overflow-hidden">
            
            <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Interactive Daily Check-In
            </h2>

            {feedback && (
              <div className="p-4 rounded-xl bg-[#5582A8]/10 border border-[#5582A8]/20 space-y-2 animate-in fade-in duration-200">
                <p className="text-xs font-mono font-bold text-[#5582A8] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> BuddyBot Personal Feedback:
                </p>
                <p className="text-xs text-gray-200 leading-relaxed font-sans italic">
                  &ldquo;{feedback}&rdquo;
                </p>
                <div className="pt-1 flex gap-2">
                  <button 
                    onClick={() => setFeedback("")}
                    className="text-[10px] bg-black/25 text-gray-400 hover:text-white px-2 py-1 rounded transition-colors"
                  >
                    Close Feedback Box
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 text-xs bg-red-400/10 border border-red-400/20 text-red-300 rounded-lg">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleMoodSubmit} className="space-y-6">
              
              {/* SLIDER SCORE BUTTONS */}
              <div className="space-y-3">
                <label className="block text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">
                  1. Rate Your Mood Score
                </label>
                <div className="grid grid-cols-5 gap-2 md:gap-3">
                  {[
                    { val: 1, label: "Awful", color: "hover:bg-red-500/10 hover:border-red-500/40Selected", border: "border-red-500/20", text: "text-red-400" },
                    { val: 2, label: "Bad", color: "hover:bg-amber-500/10 hover:border-amber-500/40Selected", border: "border-amber-400/20", text: "text-amber-400" },
                    { val: 3, label: "Meh", color: "hover:bg-gray-500/10 hover:border-gray-500/40Selected", border: "border-gray-400/20", text: "text-gray-300" },
                    { val: 4, label: "Good", color: "hover:bg-[#5582A8]/10 hover:border-[#5582A8]/40Selected", border: "border-[#5582A8]/20", text: "text-[#5582A8]" },
                    { val: 5, label: "Excellent", color: "hover:bg-emerald-500/10 hover:border-emerald-500/40Selected", border: "border-emerald-400/20", text: "text-emerald-400" }
                  ].map((btn) => {
                    const isSelected = moodValue === btn.val;
                    return (
                      <button
                        key={btn.val}
                        type="button"
                        onClick={() => setMoodValue(btn.val)}
                        className={`hover:cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all outline-none ${
                          isSelected 
                            ? "bg-indigo-600/25 border-indigo-500 text-white scale-[1.03] shadow-lg shadow-indigo-950/40" 
                            : "bg-black/20 border-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        <span className="text-lg md:text-xl">{btn.val === 1 ? "😭" : btn.val === 2 ? "😔" : btn.val === 3 ? "😐" : btn.val === 4 ? "😄" : "🚀"}</span>
                        <span className="text-[10px] font-bold tracking-tight">{btn.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* EMOTIONS CHECKERS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">
                    2. Select Your Specific feelings ({selectedEmotions.length} logged)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="text-[10px] text-indigo-400 hover:underline flex items-center gap-0.5"
                  >
                    <Info className="w-3 h-3" /> Why label feelings?
                  </button>
                </div>

                {showExplanation && (
                  <p className="text-[11px] text-gray-400 bg-white/5 p-3 rounded-lg border border-white/5 leading-relaxed animate-in slide-in-from-top-1 duration-150">
                    Scientific research proves that naming difficult emotions reduces their physical intensity. By tagging &apos;anxious&apos; or &apos;overwhelmed&apos;, you signal your amygdala to calm down.
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {CONST_EMOTIONS.map((emo) => {
                    const isSelected = selectedEmotions.includes(emo.id);
                    return (
                      <button
                        key={emo.id}
                        type="button"
                        onClick={() => handleEmotionToggle(emo.id)}
                        className={`hover:cursor-pointer px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          isSelected 
                            ? "bg-indigo-500/15 border-indigo-400 text-white shadow-sm" 
                            : "bg-black/15 border-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        {emo.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ACTIVITIES CHECKERS */}
              <div className="space-y-3">
                <label className="block text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">
                  3. What activities have you engaged in? (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONST_ACTIVITIES.map((act) => {
                    const isSelected = selectedActivities.includes(act.id);
                    return (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => handleActivityToggle(act.id)}
                        className={`hover:cursor-pointer px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          isSelected 
                            ? "bg-[#5582A8]/15 border-[#5582A8] text-white shadow-sm" 
                            : "bg-black/15 border-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        {act.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PRIVATE NOTES */}
              <div className="space-y-2">
                <label className="block text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">
                  4. Add Private Notes / Daily Context
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What's causing this feeling today? Quizzes, home life, friend groups, or procrastination? Let it out anonymously (Strictly secure!)."
                  className="w-full p-3.5 text-xs md:text-sm bg-black/25 border border-white/8 rounded-xl text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 hover:cursor-pointer flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-indigo-900/40 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      Save Safe Check-in (+15 XP)
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* STATS ANALYTICS & TIMELINE HISTORIES COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ANALYTICS CHART BLOCK */}
          {renderInteractiveChart()}

          {/* MOOD HISTORY TIMELINE CARDS */}
          <div className="rounded-2xl bg-glass border border-white/6 p-5 space-y-4">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-[#5582A8]" />
              Safe History Timeline
            </h3>

            {history.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">
                Your secure timeline history will build up here. Let's record your first log above!
              </p>
            ) : (
              <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                {history.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getMoodFaceEmoji(item.moodValue)}
                        <div>
                          <h4 className="text-xs font-bold text-white">{getMoodString(item.moodValue)}</h4>
                          <span className="text-[9px] text-gray-500 font-mono">
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-gray-300 italic font-sans leading-relaxed p-2.5 rounded bg-black/15 border-l-2 border-indigo-500/40">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {item.emotions.map((emo, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-[#a5b4fc] font-semibold border border-indigo-500/10">
                          {emo.charAt(0).toUpperCase() + emo.slice(1)}
                        </span>
                      ))}
                      {item.activities && item.activities.map((act, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-semibold border border-[#5582A8]/10">
                          {act.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
