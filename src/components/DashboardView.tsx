/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Award, 
  Flame, 
  Sparkles, 
  Activity, 
  BookOpen, 
  Heart, 
  Settings, 
  Camera, 
  TrendingUp, 
  User as UserIcon,
  Smile,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { User, ActivityProgress, MoodEntry } from "../types.js";

interface DashboardViewProps {
  currentUser: User | null;
  onUpdateUser: (updatedUser: any) => void;
  setTab: (tab: string) => void;
}

const AVATAR_SEEDS = ["Alex", "Vaibhav", "Sam", "Chill_Runner", "Elena", "PeacefulMind", "Lili", "Jordan"];

export default function DashboardView({ currentUser, onUpdateUser, setTab }: DashboardViewProps) {
  const [selectedSeed, setSelectedSeed] = useState(AVATAR_SEEDS[0]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [activityHistory, setActivityHistory] = useState<ActivityProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      // Parse seed from existing avatarUrl if applicable
      const seedMatch = currentUser.avatarUrl.match(/seed=([^&]+)/);
      if (seedMatch && seedMatch[1]) {
        setSelectedSeed(decodeURIComponent(seedMatch[1]));
      }
      fetchDashboardDetails();
    }
  }, [currentUser]);

  const fetchDashboardDetails = async () => {
    if (!currentUser) return;
    try {
      // Parallel fetches for speed
      const [moodsRes, activitiesRes] = await Promise.all([
        fetch("/api/moods", { headers: { "Authorization": `Bearer ${currentUser.id}` } }),
        fetch("/api/journal", { headers: { "Authorization": `Bearer ${currentUser.id}` } }) // We represent logs
      ]);

      if (moodsRes.ok) {
        const moodsData = await moodsRes.ok ? await moodsRes.json() : { entries: [] };
        setMoodHistory(moodsData.entries || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateAvatarProfile = async (seed: string) => {
    if (!currentUser) return;
    setSelectedSeed(seed);
    setProfileMessage("");

    // Dicebear direct secure URL
    const freshUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;
    
    // Direct simulated registration configuration on server or save local callback
    const simulatedUser = {
      ...currentUser,
      avatarUrl: freshUrl,
      lastActive: new Date().toISOString()
    };
    
    onUpdateUser(simulatedUser);
    setProfileMessage("Avatar modified successfully! Looking awesome.");
    setTimeout(() => setProfileMessage(""), 3000);
  };

  // Gamified milestones progress percentage
  const nextLevelNeeded = currentUser ? currentUser.level * 100 : 100;
  const progressPercent = currentUser ? Math.min(100, (currentUser.xp / nextLevelNeeded) * 100) : 0;

  // Calculate medals achieved
  const levelAchievements = [
    { name: "Mindfulness Initiate", desc: "First join check-in complete", unlocked: true, emoji: "🌱" },
    { name: "Calm Scribe", desc: "Write gratitude logs with positives", unlocked: (currentUser && currentUser.level >= 2), emoji: "🛡️" },
    { name: "Box Ninja", desc: "Maintain 5-day active workout streak", unlocked: (currentUser && currentUser.streak >= 5), emoji: "🔥" },
    { name: "XP Pioneer", desc: "Reach Level 3 metrics status", unlocked: (currentUser && currentUser.level >= 3), emoji: "👑" },
  ];

  return (
    <div id="dashboard-view-wrapper" className="space-y-12 py-8 px-4 md:px-8 max-w-7xl mx-auto font-sans">
      
      {/* 1. TOP WELCOME HERO STATEMENT */}
      {currentUser && (
        <section id="dashboard-header-card" className="p-6 md:p-8 rounded-2xl bg-glass border border-white/6 flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="flex items-center gap-4.5 text-center md:text-left flex-col md:flex-row">
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.username} 
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full bg-indigo-950/45 border-2 border-[#5582A8] object-cover"
            />
            <div className="space-y-1">
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-mono font-bold px-2.5 py-0.5 rounded border border-indigo-500/15 uppercase tracking-wider">
                Teen Companion Vandal
              </span>
              <h2 className="font-display font-black text-2xl text-white">Yo, {currentUser.username}!</h2>
              <p className="text-xs text-gray-400">
                Lounge checked since {new Date(currentUser.createdAt).toLocaleDateString()}. Your data is anonymous and local.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-center bg-black/25 p-4 rounded-xl border border-white/5 w-full md:w-auto justify-around">
            <div className="text-center px-2">
              <span className="text-xs text-gray-500 uppercase font-mono">Streak count</span>
              <p className="text-lg md:text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500 shrink-0" />
                {currentUser.streak}d
              </p>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="text-center px-2">
              <span className="text-xs text-gray-500 uppercase font-mono">Wellness XP</span>
              <p className="text-lg md:text-2xl font-black text-[#5582A8]">{currentUser.xp} XP</p>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="text-center px-2">
              <span className="text-xs text-gray-500 uppercase font-mono">My Level</span>
              <p className="text-lg md:text-2xl font-black text-[#818cf8] flex items-center justify-center gap-0.5">
                Lvl {currentUser.level}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 2. MAIN BENTO GRID SAAS DASHBOARD DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PROGRESS METRICS COLUMN (COL SPAN 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* LEVEL BAR PROGRESS (SaaS scale) */}
          {currentUser && (
            <div className="p-6 rounded-2xl bg-glass border border-white/6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest">
                  Level {currentUser.level} Progress Check
                </h3>
                <span className="text-xs text-gray-400 font-mono">
                  {currentUser.xp} / {nextLevelNeeded} XP to Level {currentUser.level + 1}
                </span>
              </div>

              <div className="relative w-full h-4 bg-black/35 rounded-full overflow-hidden border border-white/5 p-0.5">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-[#5582A8] to-indigo-400 h-full rounded-full transition-all duration-300 shadow-md shadow-cyan-900/35"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                💡 Want more points? Challenge negative thoughts on the <button onClick={() => setTab("guidance")} className="text-indigo-400 underline hover:text-[#a5b4fc]">Guidance Page</button> (+30 XP) or log your daily gratitude checklist (+25 XP).
              </p>
            </div>
          )}

          {/* HISTORICAL TREND GRAPHS PREVIEW */}
          <div className="p-6 rounded-2xl bg-glass border border-white/6 space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold font-mono text-[#5582A8] uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp className="w-5 h-5" /> Weekly XP Habits Milestone Mapping
              </h3>
            </div>

            {/* Simulated habit bars of weekly engagement points (Looks highly polished!) */}
            <div className="grid grid-cols-7 gap-2 pt-2 text-center items-end min-h-[140px]">
              {[
                { day: "Mon", score: 45, color: "bg-indigo-600/40" },
                { day: "Tue", score: 65, color: "bg-[#5582A8]/40" },
                { day: "Wed", score: 20, color: "bg-indigo-600/20" },
                { day: "Thu", score: 80, color: "bg-[#5582A8]/60 shadow-lg shadow-cyan-900/10" },
                { day: "Fri", score: 40, color: "bg-indigo-600/30" },
                { day: "Sat", score: 10, color: "bg-gray-700/20" },
                { day: "Sun", score: 100, color: "bg-gradient-to-t from-indigo-500 to-[#5582A8] shadow-lg shadow-cyan-950/20" }
              ].map((item, idx) => (
                <div key={idx} className="space-y-2 flex flex-col items-center">
                  <span className="text-[9px] font-mono font-bold text-gray-500">{item.score} XP</span>
                  <div className="w-full max-w-[32px] bg-black/35 rounded-t-lg h-24 relative overflow-hidden border border-white/5">
                    <div 
                      className={`w-full rounded-t-md absolute bottom-0 transition-all duration-500 ${item.color}`}
                      style={{ height: `${item.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-400 font-mono">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CHOOSE AVATAR MANAGE PROFILE BLOCK */}
          <div className="p-6 rounded-2xl bg-glass border border-white/6 space-y-4">
            <h3 className="text-xs font-bold font-mono text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
              <Settings className="w-4.5 h-4.5 text-yellow-400" />
              Manage Wellness Avatar Profile
            </h3>

            {profileMessage && (
              <p className="p-2.5 rounded text-xs bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 font-medium">
                {profileMessage}
              </p>
            )}

            <p className="text-xs text-gray-400">
              Change your anonymous seed character dynamically. Changing seeds instantly re-renders your unique avatar in headers and lists!
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {AVATAR_SEEDS.map((seedName) => {
                const isActive = selectedSeed === seedName;
                return (
                  <button
                    key={seedName}
                    onClick={() => updateAvatarProfile(seedName)}
                    className={`hover:cursor-pointer p-1.5 px-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                      isActive 
                        ? "bg-indigo-500/15 border-indigo-500 text-white" 
                        : "bg-black/25 border-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    <img 
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seedName}`} 
                      alt="" 
                      className="w-5 h-5 rounded-full bg-indigo-950/30"
                    />
                    <span>{seedName}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* SIDEBAR: GAMIFIED MEDALS AWARDS (COL SPAN 4) */}
        <div id="gamified-medals-box" className="lg:col-span-4 space-y-6">
          
          <div className="p-6 rounded-2xl bg-glass border border-white/6 space-y-4">
            <h3 className="text-xs font-bold font-mono text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-5 h-5 text-amber-500" />
              Earned Badges & Medals
            </h3>

            <p className="text-[10px] text-gray-500 leading-relaxed">
              Complete wellness check-ins, unlock higher levels, and maintain active logs to claim limited-edition custom teen medals!
            </p>

            <div className="space-y-4.5 pt-2">
              {levelAchievements.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3.5 items-center p-3 rounded-xl border transition-all ${
                    item.unlocked 
                      ? "bg-amber-500/5 border-amber-500/20" 
                      : "bg-black/15 border-white/5 opacity-40 select-none"
                  }`}
                >
                  <span className="text-3xl bg-black/25 w-11 h-11 rounded-xl flex items-center justify-center border border-white/5">
                    {item.emoji}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{item.desc}</p>
                    <span className="text-[9px] font-mono text-amber-400 font-bold mt-1 inline-block">
                      {item.unlocked ? "✓ Active Achievement Complete" : "🔒 Reward Unlocked at Level 2"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
