/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  Smile, 
  Award, 
  Flame, 
  Volume2, 
  VolumeX, 
  Timer, 
  Plus, 
  Compass, 
  ChevronLeft,
  RefreshCw,
  Eye,
  CheckCircle2
} from "lucide-react";
import { User, JournalEntry } from "../types.js";

interface ActivitiesHubProps {
  currentUser: User | null;
  onLogActivity: (activityId: string, type: "breathing" | "affirmation" | "journal" | "challenge", xp: number) => void;
  onUpdateUser: (updatedUser: any) => void;
}

const AFFIRMATIONS = [
  "My worth isn't defined by grades, points, or other people's opinions.",
  "I am doing the best I can, and that is more than enough.",
  "I have boundaries, and it is healthy to communicate them clearly.",
  "Making mistakes is just part of how I learn and grow into myself.",
  "It is okay to ask for support; taking care of myself is strength.",
  "I design my own pace in high school, and I trust my capability.",
  "My feelings are temporary indicators, and I am highly resilient.",
  "I am proud of my progress, especially the steps no one else sees.",
  "I deserve peaceful breaks and screens-free space to restore my vibe.",
  "I belong here, and my voice holds value."
];

const DAILY_MOTIVATIONS = [
  { id: "m1", title: "Social Comparison", advice: "Comparing your standard days to everyone else's edited social highlights is an unfair match. Run your own race.", icon: "🌌" },
  { id: "m2", title: "Procrastination Shield", advice: "You are avoiding that homework because you are anxious about failing. Break it into a 5-minute task first, starting is the win.", icon: "⚡" },
  { id: "m3", title: "People Pleasing", advice: "Saying 'No' to things that drain you is how you protect your mental health assets. True friends respect boundaries.", icon: "🛡️" },
  { id: "m4", title: "Self Compassion", advice: "Talk to yourself the same way you would comfort your closest friend in distress.", icon: "🌸" }
];

export default function ActivitiesHub({ currentUser, onLogActivity, onUpdateUser }: ActivitiesHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<"breathing" | "affirmations" | "gratitude" | "motivation">("breathing");
  
  // Breathing Trainer State
  const [breathingPattern, setBreathingPattern] = useState<"box" | "calm" | "belly">("box");
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"In" | "Hold" | "Out" | "Hold Out">("In");
  const [breathTimer, setBreathTimer] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Affirmations State
  const [affirmationText, setAffirmationText] = useState(AFFIRMATIONS[0]);
  const [spinningAff, setSpinningAff] = useState(false);

  // Gratitude Journal State
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [journalMood, setJournalMood] = useState(4);
  const [journalHistory, setJournalHistory] = useState<JournalEntry[]>([]);
  const [journalSuccess, setJournalSuccess] = useState(false);
  const [savingJournal, setSavingJournal] = useState(false);

  // Motivation Flip State
  const [revealedMotivations, setRevealedMotivations] = useState<string[]>([]);

  // Weekly Challenges Checklist State
  const [challenges, setChallenges] = useState([
    { id: "ch1", label: "Complete 1 full Breathing exercise block", completed: false, xp: 15 },
    { id: "ch2", label: "Read at least one Daily Motivation advice card", completed: false, xp: 10 },
    { id: "ch3", label: "Post a Gratitude Entry inside the private journal", completed: false, xp: 25 },
    { id: "ch4", label: "Audit screen Curfew Curricular for saturday focus limit", completed: false, xp: 20 },
  ]);

  useEffect(() => {
    if (currentUser) {
      loadJournals();
    }
  }, [currentUser]);

  // Breathing simulation counter effects
  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            // Cycle Phases depending on pattern
            if (breathingPattern === "box") {
              // Box: In (4s) -> Hold In (4s) -> Out (4s) -> Hold Out (4s)
              if (breathPhase === "In") {
                setBreathPhase("Hold");
                return 4;
              } else if (breathPhase === "Hold") {
                setBreathPhase("Out");
                return 4;
              } else if (breathPhase === "Out") {
                setBreathPhase("Hold Out");
                return 4;
              } else {
                setBreathPhase("In");
                setCyclesCompleted((c) => c + 1);
                return 4;
              }
            } else if (breathingPattern === "calm") {
              // Calm: In (4s) -> Hold (7s) -> Out (8s)
              if (breathPhase === "In") {
                setBreathPhase("Hold");
                return 7;
              } else if (breathPhase === "Hold") {
                setBreathPhase("Out");
                return 8;
              } else {
                setBreathPhase("In");
                setCyclesCompleted((c) => c + 1);
                return 4;
              }
            } else {
              // Belly: In (5s) -> Out (5s)
              if (breathPhase === "In") {
                setBreathPhase("Out");
                return 5;
              } else {
                setBreathPhase("In");
                setCyclesCompleted((c) => c + 1);
                return 5;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase, breathingPattern]);

  // Automatic complete breathing after multiple cycles finished.
  useEffect(() => {
    if (cyclesCompleted >= 4) {
      setIsBreathingActive(false);
      setCyclesCompleted(0);
      setBreathTimer(4);
      setBreathPhase("In");
      
      // Complete rewarding XP
      onLogActivity("breathing_" + breathingPattern, "breathing", 20);
      
      // Mark matching task done
      setChallenges((prev) =>
        prev.map((c) => (c.id === "ch1" ? { ...c, completed: true } : c))
      );
      alert("Awesome breathing block! You completed 4 relaxing cycles and secured +20 XP.");
    }
  }, [cyclesCompleted, breathingPattern]);

  const loadJournals = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/journal", {
        headers: { "Authorization": `Bearer ${currentUser.id}` }
      });
      if (res.ok) {
        const data = await res.json();
        setJournalHistory(data.entries || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const spinAffirmations = () => {
    setSpinningAff(true);
    let index = 0;
    const interval = setInterval(() => {
      index = Math.floor(Math.random() * AFFIRMATIONS.length);
      setAffirmationText(AFFIRMATIONS[index]);
    }, 70);

    setTimeout(() => {
      clearInterval(interval);
      setSpinningAff(false);
      onLogActivity("affirmation_daily", "affirmation", 10);
    }, 1200);
  };

  const handleJournalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSavingJournal(true);

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.id}`
        },
        body: JSON.stringify({
          title: journalTitle,
          content: journalContent,
          moodRating: journalMood
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setJournalTitle("");
      setJournalContent("");
      setJournalSuccess(true);
      
      onUpdateUser(data.user);
      loadJournals();

      // Complete challenge checklist
      setChallenges((prev) =>
        prev.map((c) => (c.id === "ch3" ? { ...c, completed: true } : c))
      );
    } catch (err: any) {
      alert(err.message || "Failed saving gratitude entry.");
    } finally {
      setSavingJournal(false);
    }
  };

  const handleRevealMotivation = (id: string) => {
    if (!revealedMotivations.includes(id)) {
      setRevealedMotivations([...revealedMotivations, id]);
      onLogActivity("motivation_card_" + id, "affirmation", 10);
      
      setChallenges((prev) =>
        prev.map((c) => (c.id === "ch2" ? { ...c, completed: true } : c))
      );
    }
  };

  const toggleChallengeManual = (id: string, xpReward: number) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id && !c.completed) {
          onLogActivity(id + "_custom", "challenge", xpReward);
          return { ...c, completed: true };
        }
        return c;
      })
    );
  };

  return (
    <div id="activities-hub-container" className="space-y-12 py-8 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/15 text-xs font-mono">
          <Sparkles className="w-4 h-4 text-[#5582A8]" />
          Teen Activities & Mindfulness Lounge
        </div>
        <h1 className="font-display font-black text-3xl md:text-5xl text-white">Your Wellness Activity hub</h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          Participate in gamified mental exercises, store gratitude logs with custom mood metrics, and claim health XP.
        </p>
      </div>

      {/* THREE LAYOUT COLUMNER GRID: MAIN CORE CHANNELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INTERACTIVE COMPONENT CHANNEL AREA (COL SPAN 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TOP CONTROLLERS ROW BAR */}
          <div className="flex border-b border-white/5 gap-1 overflow-x-auto pb-1">
            {[
              { id: "breathing", label: "Breathing Bubble 🫧" },
              { id: "affirmations", label: "Vibe Affirmations ✨" },
              { id: "gratitude", label: "Gratitude Journal ✍️" },
              { id: "motivation", label: "Motivation Cards 🃏" }
            ].map((subTab) => (
              <button
                key={subTab.id}
                onClick={() => {
                  setActiveSubTab(subTab.id as any);
                  setJournalSuccess(false);
                }}
                className={`hover:cursor-pointer px-4.5 py-3 text-xs md:text-sm font-semibold transition-all shrink-0 rounded-t-xl ${
                  activeSubTab === subTab.id 
                    ? "bg-[#101223] text-[#5582A8] border-b-2 border-[#5582A8]" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {subTab.label}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8 rounded-2xl bg-glass border border-white/6 min-h-[380px] flex flex-col justify-between">
            
            {/* SUB TAB 1: BREATHING TRAINER */}
            {activeSubTab === "breathing" && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-white font-display">Deep Breathing Sync-Loop</h3>
                  <p className="text-xs text-gray-400">
                    Coordinate your breathing with the growing bubble below. Recommended for drop stress and fast calming.
                  </p>
                </div>

                {/* PATTERN SELECTOR CHIPS */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {[
                    { id: "box", label: "Box Breathing (4-4-4-4)", desc: "Navy SEAL focus standard" },
                    { id: "calm", label: "4-7-8 Breathing Calm", desc: "Dr. Weil sleep trigger" },
                    { id: "belly", label: "Diaphragmatic (5-5)", desc: "Relieve instant panic" }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setBreathingPattern(p.id as any);
                        setIsBreathingActive(false);
                        setCyclesCompleted(0);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        breathingPattern === p.id 
                          ? "bg-[#5582A8]/15 border-[#5582A8] text-cyan-300" 
                          : "bg-black/15 border-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* INTERACTIVE GROWING BREATHING BUBBLE */}
                <div className="py-6 flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    
                    {/* Breathing pulse rings */}
                    <div 
                      className={`absolute rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-cyan-400/40 transition-all duration-[3500ms] ease-in-out ${
                        isBreathingActive && (breathPhase === "In" || breathPhase === "Hold") 
                          ? "w-36 h-36" 
                          : "w-20 h-20"
                      }`}
                    />

                    {/* Core central ball */}
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#6B4FA0] to-[#5582A8] flex flex-col items-center justify-center text-white font-bold text-center select-none shadow-xl shadow-cyan-950/40 border border-white/10">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#e0f1fe]">
                        {isBreathingActive ? breathPhase : "Ready"}
                      </span>
                      {isBreathingActive && (
                        <span className="text-lg font-black font-mono mt-0.5">{breathTimer}s</span>
                      )}
                    </div>

                  </div>

                  <p className="text-xs text-gray-400 font-mono text-center">
                    {isBreathingActive 
                      ? `Cycle ${cyclesCompleted + 1} of 4 cycles completing` 
                      : "Click Start, sit straight, empty your lungs, and follow the rhythm."}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsBreathingActive(!isBreathingActive);
                      if (!isBreathingActive) {
                        setBreathPhase("In");
                        setBreathTimer(breathingPattern === "box" ? 4 : breathingPattern === "calm" ? 4 : 5);
                        setCyclesCompleted(0);
                      }
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs md:text-sm transition-colors ${
                      isBreathingActive 
                        ? "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25" 
                        : "bg-[#5582A8] hover:bg-[#5582A8]/95 text-white shadow-lg"
                    }`}
                  >
                    {isBreathingActive ? "Pause Breathing Trainer" : "Start 4 Cycles Breathing"}
                  </button>
                </div>
              </div>
            )}

            {/* SUB TAB 2: AFFIRMATIONS SPINNER WHEEL */}
            {activeSubTab === "affirmations" && (
              <div className="space-y-6 text-center flex-1 flex flex-col justify-between max-w-xl mx-auto">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-display">Daily Affirmation Charger</h3>
                  <p className="text-xs text-gray-400">
                    Spins an encouraging playlist of youth psychological affirmations. Read it, take 5 seconds to absorb, and let it build inner calm.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-center min-h-[140px] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-grid-white opacity-5" />
                  <p className={`text-base font-semibold text-white tracking-wide leading-relaxed font-sans ${spinningAff ? "blur-md scale-95" : "animate-in fade-in duration-200"}`}>
                    &ldquo;{affirmationText}&rdquo;
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={spinAffirmations}
                    disabled={spinningAff}
                    className="hover:cursor-pointer px-6 py-2.5 hover:bg-indigo-500 font-bold text-xs bg-indigo-600 text-white rounded-lg transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <RefreshCw className={`w-4 h-4 ${spinningAff ? "animate-spin" : ""}`} />
                    Spin Affirmation wheel (+10 XP)
                  </button>
                </div>
              </div>
            )}

            {/* SUB TAB 3: GRATITUDE JOURNAL */}
            {activeSubTab === "gratitude" && (
              <div className="space-y-6 flex-1">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white font-display">Your private Gratitude Journal</h3>
                  <p className="text-xs text-gray-400">
                    Writing down positive moments tells your subconscious mind to catalog good memories instead of overthinking stresses.
                  </p>
                </div>

                {journalSuccess ? (
                  <div className="text-center py-6 space-y-3 animate-in fade-in zoom-in duration-200">
                    <CheckCircle2 className="w-12 h-12 text-[#5582A8] mx-auto" />
                    <p className="text-sm font-semibold text-white">Gratitude post logged!</p>
                    <p className="text-xs text-gray-400">Saved securely inside your database timeline. Completed +25 XP reward!</p>
                    <button 
                      onClick={() => setJournalSuccess(false)}
                      className="px-4 py-1.5 bg-black/25 text-indigo-400 hover:text-white rounded text-xs"
                    >
                      Write another journal log
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleJournalSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Entry Title</label>
                        <input
                          type="text"
                          required
                          value={journalTitle}
                          onChange={(e) => setJournalTitle(e.target.value)}
                          placeholder="e.g., Evening park jog with Sam"
                          className="w-full p-2.5 text-xs bg-black/25 border border-white/10 rounded-lg text-white outline-none focus:border-[#6B4FA0]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Emotion Rating (1-5)</label>
                        <select
                          value={journalMood}
                          onChange={(e) => setJournalMood(parseInt(e.target.value))}
                          className="w-full p-2.5 text-xs bg-black/35 border border-white/10 rounded-lg text-gray-200 outline-none focus:border-[#6B4FA0]"
                        >
                          <option value="5">Vibe: Excellent 🚀</option>
                          <option value="4">Vibe: Good ✨</option>
                          <option value="3">Vibe: Neutral/Steady ☁️</option>
                          <option value="2">Vibe: Low/Tired 🌧️</option>
                        </select>
                      </div>

                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">What went right? Name 3 things you appreciate</label>
                      <textarea
                        required
                        rows={3}
                        value={journalContent}
                        onChange={(e) => setJournalContent(e.target.value)}
                        placeholder="Today I am grateful for... (e.g., Mom making hot cocoa, figuring out the geometry problem early, having a fast gaming session with friends. Focus purely on positives!)."
                        className="w-full p-3 text-xs bg-black/25 border border-white/10 rounded-xl text-white outline-none focus:border-[#6B4FA0] font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingJournal}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs md:text-sm rounded-lg transition-colors"
                    >
                      {savingJournal ? "Saving..." : "Save Private Journal Post (+25 XP)"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* SUB TAB 4: MOTIVATION CARDS (Grid elements flip style) */}
            {activeSubTab === "motivation" && (
              <div className="space-y-6 flex-1">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-display">Daily Inspiration Flip-Cards</h3>
                  <p className="text-xs text-gray-400">
                    Click onto any card to reveal structured advice and unlock +10 XP daily wellness points!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {DAILY_MOTIVATIONS.map((card) => {
                    const isRevealed = revealedMotivations.includes(card.id);
                    return (
                      <div
                        key={card.id}
                        onClick={() => handleRevealMotivation(card.id)}
                        className={`hover:cursor-pointer p-4 rounded-xl border text-left transition-all ${
                          isRevealed 
                            ? "bg-indigo-950/20 border-indigo-500/40" 
                            : "bg-glass hover:bg-white/5 border-white/5 active:scale-[0.99]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{card.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{card.title}</h4>
                            <p className="text-[10px] text-gray-500">
                              {isRevealed ? "✓ Revealed! +10 XP" : "Click to reveal advice card"}
                            </p>
                          </div>
                        </div>
                        {isRevealed && (
                          <p className="text-xs text-gray-300 mt-2.5 italic border-t border-white/5 pt-2 leading-relaxed animate-in fade-in duration-200">
                            {card.advice}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* SIDEBAR: ACTIVE GAMIFIED CHALLENGES (COL SPAN 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* CHALLENGES CONTAINER BOARD */}
          <div className="p-6 rounded-2xl bg-glass border border-white/6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Award className="w-5 h-5" />
                Active Weekly Challenges
              </h3>
            </div>

            <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
              Complete these specific wellness drills to unlock dynamic medals and accelerate level progress!
            </p>

            <div className="space-y-3 pt-2">
              {challenges.map((c) => (
                <div 
                  key={c.id} 
                  className={`p-3 rounded-xl border flex gap-3 items-start transition-all ${
                    c.completed 
                      ? "bg-emerald-500/5 border-emerald-500/20" 
                      : "bg-black/15 border-white/5 hover:border-white/10"
                  }`}
                >
                  <button
                    disabled={c.completed}
                    onClick={() => toggleChallengeManual(c.id, c.xp)}
                    className={`hover:cursor-pointer w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      c.completed 
                        ? "bg-emerald-500 border-emerald-500 text-black" 
                        : "border-gray-500 hover:border-white"
                    }`}
                  >
                    {c.completed && "✓"}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] leading-snug font-medium ${c.completed ? "text-gray-500 line-through" : "text-gray-200"}`}>
                      {c.label}
                    </p>
                    <span className="text-[9px] font-mono text-yellow-400 font-bold mt-1 inline-block">
                      {c.completed ? "Claimed ✓" : `+${c.xp} XP`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PRIVATE JOURNAL TIMELINE RECENT ENTRIES LIST */}
          <div className="p-6 rounded-2xl bg-glass border border-white/6 space-y-3.5">
            <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Recent Gratitude Logs
            </h3>

            {journalHistory.length === 0 ? (
              <p className="text-[10px] text-gray-500 text-center py-6 leading-relaxed">
                No recent entries. Go to the Gratitude Journal tab write down 3 good things today!
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[170px] overflow-y-auto pr-1">
                {journalHistory.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-2.5 rounded bg-black/15 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white truncate max-w-[150px]">{item.title}</span>
                      <span className="text-[9px] font-mono text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-normal truncate">{item.content}</p>
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
