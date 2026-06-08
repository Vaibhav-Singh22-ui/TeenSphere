/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BookOpen, 
  ChevronRight, 
  TrendingUp, 
  HelpCircle, 
  Award, 
  HelpCircle as QuestionIcon,
  Smile, 
  AlertCircle,
  Lightbulb,
  Frown,
  CheckSquare,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface GuidanceViewProps {
  currentUser: any;
  onLogActivity: (activityId: string, type: "breathing" | "affirmation" | "journal" | "challenge", xp: number) => void;
  openAuthModal: () => void;
}

interface AdviceCategory {
  id: string;
  category: string;
  title: string;
  badge: string;
  icon: string;
  advice: string;
  steps: string[];
  activityTitle: string;
  activityDesc: string;
}

export default function GuidanceView({ currentUser, onLogActivity, openAuthModal }: GuidanceViewProps) {
  const [selectedCat, setSelectedCat] = useState<string>("academic_stress");
  
  // CBT Reframer details state
  const [situation, setSituation] = useState("");
  const [negThought, setNegThought] = useState("");
  const [selectedDistortion, setSelectedDistortion] = useState("All-or-Nothing Thinking");
  const [positiveRefining, setPositiveRefining] = useState("");
  const [reframedSuccess, setReframedSuccess] = useState(false);

  const categories: AdviceCategory[] = [
    {
      id: "academic_stress",
      category: "Academic Stress",
      badge: "Self-Care",
      icon: "📚",
      title: "Taking the Lead Over Grade Pressure",
      advice: "Academic stress usually happens when we define our whole worth by percentage scores. Remember that learning is a process of trial and error.",
      steps: [
        "Chunk your study blocks into 25-minute Pomodoro sections followed by solid 5-minute chill breaks.",
        "Talk to your teacher early when chapters feel confusing, before homework starts backing up.",
        "Maintain a dedicated workspace away from your bed to signal your brain that it's okay to switch-off."
      ],
      activityTitle: "School Stress Check-in Matrix",
      activityDesc: "Divide your tasks into Urgent vs. Important quadrants. Write down the top things causing pressure, and cross out anything you can't control."
    },
    {
      id: "exam_anxiety",
      category: "Exam Anxiety",
      badge: "Nerve Calming",
      icon: "📝",
      title: "Defeating Exam Mind-freeze",
      advice: "Anxiety is a physical nervous system mechanism, not an indicator of failure. When we feel anxious, our heart rate spikes. We can use physical patterns to calm it.",
      steps: [
        "Practice Box Breathing (4-4-4-4) right when the test paper is handed out to drop adrenaline spikes.",
        "Read instructions slowly and cross out multiple-choice answers you know are wrong first.",
        "Avoid discussing exam materials right outside the testing room with frantic classmates."
      ],
      activityTitle: "Practice Calm Breathing",
      activityDesc: "Sit quietly for 3 minutes before reviewing mock quizzes and synchronize with Box Breathing in the Activities Center."
    },
    {
      id: "friendship_problems",
      category: "Friendship Problems",
      badge: "Relationships",
      icon: "🤝",
      title: "Dealing with Social Changes & Frictions",
      advice: "Friendships change in high school, and it can feel incredibly lonely. Communication is key, but so is understanding your personal boundaries.",
      steps: [
        "Address miscommunications face-to-face when possible. Texting lacks tone and often escalates issues.",
        "If a friend makes you feel small or constantly drains you, it is healthy to adjust your closeness.",
        "Seek groups with common activity interests (games, sports, art) to branch out without social pressure."
      ],
      activityTitle: "Active Boundaries Draft",
      activityDesc: "List 3 things you require from closer friendships, and 2 behaviors you will politely decline to engage in."
    },
    {
      id: "family_conflicts",
      category: "Family Conflicts",
      badge: "Connection",
      icon: "🏡",
      title: "Explaining Boundaries to Parents Anonymously",
      advice: "Conflicts at home often stem from parents struggling to adapt to teenagers growing into independent adults. Explaining boundaries takes strategy.",
      steps: [
        "Initiate dialogue during 'low-stress' times, instead of mid-argument over room tidying or screen time.",
        "Use 'I feel' comments: 'I feel swamped when I'm quizzed about grades right when I walk in from school. Could we talk about that weekly instead?'",
        "Offer compromises. Show responsibility in small tasks to buy currency for larger freedoms."
      ],
      activityTitle: "Family Reconnect Compromise worksheet",
      activityDesc: "Identify one regular household pain-point. Draft 2 alternative compromise approaches you will present to your parent/guardian."
    },
    {
      id: "social_media",
      category: "Social Media Pressure",
      badge: "Digital Well-being",
      icon: "📱",
      title: "Escaping the Infinite Doom-scroll",
      advice: "Social media feeds are designed by modern companies to maximize your dopamine seeking loop. You aren't lacking willpower; you're playing against algorithms.",
      steps: [
        "Deconstruct the 'highlight reels'. Remind yourself that people only post edited versions of their best days.",
        "Establish an absolute 'No-Screens' curfew for 45 minutes before sleep to facilitate restorative sleep cycles.",
        "Audit who you follow. Unfollow or mute accounts blockading your mental peace or causing body-image doubts."
      ],
      activityTitle: "Digital Screen-Diet Challenge",
      activityDesc: "Try locking your social apps for just 4 hours on Saturday. Replace it with real outdoor or reading activities."
    },
    {
      id: "bullying",
      category: "Bullying & Drama",
      badge: "Security",
      icon: "🛡️",
      title: "Protecting Your Peace of Mind",
      advice: "Bullying is never your fault. It is a projection of the bully's personal insecurities. Take absolute control by securing boundaries.",
      steps: [
        "Block and report immediately. Engaging with trolls or cyberbullies gives them the attention fuel they seek.",
        "Keep digital receipts of offensive texts. They are crucial if parent or school intervention is needed.",
        "Confide in a trusted teacher, counselor, or parent. Keeping it buried makes you feel more isolated."
      ],
      activityTitle: "Trusted Adult Guidance Blueprint",
      activityDesc: "Draft a private contact note detailing exactly what happened and send it to your counselor or parent. Do NOT face this alone."
    },
    {
      id: "anger_management",
      category: "Anger Management",
      badge: "Emotional Intelligence",
      icon: "🔥",
      title: "De-escalating the Fire Alarm within",
      advice: "Anger is an informational emotion signal. It tells us we feel violated, unheard, or treated unfairly. But expressing it constructively is key.",
      steps: [
        "Notice physical triggers: clenched fists, burning neck, rapid words. This is your cue to step away of the room.",
        "Implement a '10-Second Wait Policy' before replying to provoking texts or remarks.",
        "Release physical anger safely using high-energy workouts, tearing paper, or journaling."
      ],
      activityTitle: "Anger Cycle Mapping",
      activityDesc: "Write down your typical trigger points and identify 2 safe physical releases you can implement instead of shouting."
    },
    {
      id: "confidence_building",
      category: "Confidence Building",
      badge: "Growth Vibe",
      icon: "✨",
      title: "Challenging Your Internal Critic",
      advice: "Confidence is a physical habit built by doing hard things, not an automatic feeling. Small, incremental wins build robust self-belief.",
      steps: [
        "Stop waiting to 'feel ready' before trying new clubs or speaking up in group activities.",
        "Practice power postures and speaking clearly, making soft eye contact during greetings.",
        "Write down your accomplishments—even minor tasks count. Read them weekly."
      ],
      activityTitle: "Daily Power Affirmations",
      activityDesc: "Generate and repeat 3 positive affirmations daily to build fresh confidence patterns."
    },
    {
      id: "time_management",
      category: "Time Management",
      badge: "Productivity",
      icon: "⏱️",
      title: "Conquering Procrastination and Chaos",
      advice: "Procrastination isn't laziness; it is emotion regulation. We avoid tasks because they make us feel anxious or insecure. Breaking them down helps.",
      steps: [
        "Use the '5-Minute Starting rule': Tell yourself you'll study for just 5 minutes. If it feels too exhausting, you can stop. Usually, starting is the only block.",
        "Tackle the largest, most taxing homework card first thing in the morning when your mental storage is full.",
        "Schedule specific slots for video games and rest periods so they feel earned, not guilty avoidance blocks."
      ],
      activityTitle: "Focus-Sprint Pomodoro Challenge",
      activityDesc: "Complete one full Pomodoro workspace block with phone off. Earn 15 XP for productivity tracking."
    }
  ];

  const currentAdvice = categories.find(c => c.id === selectedCat) || categories[0];

  const handleCbtReframer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation || !negThought || !positiveRefining) return;

    if (!currentUser) {
      openAuthModal();
      return;
    }

    // Award XP for completing Cognitive Reappraisal Reframer
    onLogActivity("cbt_reframer_tool", "challenge", 30);
    setReframedSuccess(true);
  };

  const resetReframer = () => {
    setSituation("");
    setNegThought("");
    setPositiveRefining("");
    setReframedSuccess(false);
  };

  return (
    <div id="guidance-view-wrapper" className="space-y-12 py-8 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* HEADER STATEMENT */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/15 text-xs font-mono">
          <BookOpen className="w-4 h-4 text-[#5582A8]" />
          Teen Guidance & Advisory Library
        </div>
        <h1 className="font-display font-black text-3xl md:text-5xl text-white">How to Navigate the Hard Stuff</h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          Practical advice and active worksheets curated for teenagers handling everyday school and personal situations.
        </p>
      </div>

      {/* CORE ADVICE INTERACTIVE LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR SELECTORS */}
        <div className="w-full lg:w-72 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border font-medium text-xs md:text-sm text-left transition-all shrink-0 lg:shrink-0 ${
                selectedCat === c.id 
                  ? "bg-gradient-to-r from-indigo-950 to-indigo-900/40 text-white border-indigo-500/50 shadow-md" 
                  : "bg-glass hover:bg-white/5 text-gray-400 border-white/5"
              }`}
            >
              <span className="text-lg">{c.icon}</span>
              <span className="flex-1 truncate">{c.category}</span>
              <ChevronRight className={`w-4 h-4 hidden lg:block ${selectedCat === c.id ? "text-indigo-400" : "text-gray-600"}`} />
            </button>
          ))}
        </div>

        {/* SELECTED CATEGORY ADVICE BOARD */}
        <div className="flex-1 p-6 md:p-8 rounded-2xl bg-glass border border-white/6 space-y-6 relative">
          
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#5582A8]/10 text-[#5582A8] rounded-full border border-[#5582A8]/15">
              {currentAdvice.badge}
            </span>
            <span className="text-xs text-gray-400 italic">Select categories on left side</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-black text-2xl md:text-3xl text-white flex items-center gap-2">
              <span className="text-3xl">{currentAdvice.icon}</span>
              {currentAdvice.title}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-sans">{currentAdvice.advice}</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">Expert Action Strategy List</h3>
            <div className="space-y-3">
              {currentAdvice.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono text-xs font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs md:text-sm text-gray-300 leading-normal">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC ACTIVITY CHALLENGE DRAWER */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-950/20 to-cyan-950/25 border border-cyan-500/20 mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1 text-[10px] uppercase font-mono font-bold text-yellow-400">
                <Smile className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" /> suggested wellness activity
              </div>
              <h4 className="text-sm font-bold text-white mt-1">{currentAdvice.activityTitle}</h4>
              <p className="text-xs text-gray-400 max-w-lg leading-snug">{currentAdvice.activityDesc}</p>
            </div>
            
            <button
              onClick={() => {
                if (!currentUser) {
                  openAuthModal();
                  return;
                }
                onLogActivity(currentAdvice.id + "_ac", "challenge", 20);
                alert(`Excellent job! You simulated starting this activity challenge: "${currentAdvice.activityTitle}". Logged +20 XP!`);
              }}
              className="px-4 py-2 hover:cursor-pointer text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg shadow-md hover:scale-[1.01] transition-all whitespace-nowrap shrink-0"
            >
              Start Skill Task (+20 XP)
            </button>
          </div>

        </div>
      </div>

      {/* ADVANCED COGNITIVE REAPPRAISAL DIARY (CBT EXPERT WIDGET FOR PLATFORM MERIT) */}
      <section id="cbt-reframer-widget" className="rounded-3xl bg-glass-heavy border border-white/10 p-6 md:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#5582A8]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div className="space-y-1">
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-mono font-bold px-2.5 py-1 rounded border border-indigo-500/20 uppercase tracking-widest">
              Scientific Cognitive Tool (CBT)
            </span>
            <h3 className="font-display font-bold text-xl md:text-2xl text-white">Interactive Thought Reframer</h3>
            <p className="text-xs text-gray-400">
              When we're swamped, our brain creates &apos;Cognitive Distortions&apos;. Challenge negative patterns by rewriting thoughts.
            </p>
          </div>
          <span className="text-xs text-yellow-400 font-mono bg-yellow-500/10 border border-yellow-500/15 px-3 py-1.5 rounded-full font-bold self-start md:self-center">
            Earn 30 Wellness Points (XP)
          </span>
        </div>

        {reframedSuccess ? (
          <div className="text-center py-10 space-y-4 max-w-md mx-auto animate-in fade-in zoom-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto text-2xl animate-bounce">
              🎉
            </div>
            <h4 className="font-display font-bold text-lg text-white">Thought Challenged Successfully!</h4>
            <div className="p-4 rounded-xl bg-black/25 text-xs text-left space-y-2 border border-white/5">
              <p className="text-gray-500 uppercase font-mono font-bold text-[10px]">Your Constructive Reframing:</p>
              <p className="text-[#a5b4fc] italic font-sans leading-relaxed">&ldquo;{positiveRefining}&rdquo;</p>
              <p className="text-emerald-400 text-[11px] font-medium mt-2">✓ Logged! +30 XP credited to your wellness profile.</p>
            </div>
            <button
              onClick={resetReframer}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Refocus another thought
            </button>
          </div>
        ) : (
          <form onSubmit={handleCbtReframer} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  1. Describe the Situation causing stress
                </label>
                <textarea
                  required
                  rows={2}
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="e.g., I failed my chemistry mock test and have the real board exam in two weeks."
                  className="w-full p-3 text-xs bg-black/25 border border-white/8 rounded-xl text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  2. What is the automatic Negative Thought?
                </label>
                <div className="relative">
                  <Frown className="absolute left-3 top-3 w-4 h-4 text-red-400" />
                  <textarea
                    required
                    rows={2}
                    value={negThought}
                    onChange={(e) => setNegThought(e.target.value)}
                    placeholder="e.g., I am stupid and will never get into a decent college. Everyone is smarter than me."
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-black/25 border border-white/8 rounded-xl text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-sans"
                  />
                </div>
              </div>

            </div>

            <div className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  3. Select the Cognitive Distortion (Mind trap)
                </label>
                <select
                  value={selectedDistortion}
                  onChange={(e) => setSelectedDistortion(e.target.value)}
                  className="w-full p-2.5 text-xs bg-black/35 border border-white/8 rounded-xl text-gray-200 outline-none focus:border-indigo-500"
                >
                  <option>All-or-Nothing Thinking (I failed, so I am a complete loser)</option>
                  <option>Catastrophizing (Making problems feel like world-ending events)</option>
                  <option>Mind Reading (Assuming everyone is judging or thinks I am stupid)</option>
                  <option>Neglect the Positive (Filtering out the things I did succeed block with)</option>
                  <option>Emotional Reasoning (Feeling anxious, so disaster must be coming)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  4. Write Your Constructive, Realistic Reframe
                </label>
                <div className="relative">
                  <Smile className="absolute left-3 top-3 w-4 h-4 text-[#5582A8]" />
                  <textarea
                    required
                    rows={2}
                    value={positiveRefining}
                    onChange={(e) => setPositiveRefining(e.target.value)}
                    placeholder="e.g., Failing one mock test is tough, but it tells me exactly what I need to review. I have two weeks to study better, and I can ask the tutor for guidance."
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-black/25 border border-white/8 rounded-xl text-white outline-none focus:border-[#5582A8] focus:ring-1 focus:ring-[#5582A8] transition-all font-sans"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 hover:cursor-pointer flex items-center justify-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-[#6B4FA0] to-[#5582A8] hover:from-indigo-500 hover:to-cyan-400 rounded-xl transition-all hover:scale-[1.01]"
                >
                  Challenge Thought & Claim points (+30 XP)
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </form>
        )}
      </section>

    </div>
  );
}
