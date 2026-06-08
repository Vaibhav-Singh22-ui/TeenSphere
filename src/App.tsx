/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation.js";
import AuthModal from "./components/AuthModal.js";
import HomeView from "./components/HomeView.js";
import GuidanceView from "./components/GuidanceView.js";
import MoodCenter from "./components/MoodCenter.js";
import ActivitiesHub from "./components/ActivitiesHub.js";
import SupportCenter from "./components/SupportCenter.js";
import DashboardView from "./components/DashboardView.js";
import AdminPanel from "./components/AdminPanel.js";
import BuddyBot from "./components/BuddyBot.js";
import TeenSphereLogo from "./components/TeenSphereLogo.js";
import { User } from "./types.js";
import { Heart, ShieldCheck, HelpCircle } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    const cachedToken = localStorage.getItem("teensphere_token");
    if (!cachedToken) {
      setLoading(false);
      return;
    }

    try {
      // Connect to full-stack auth verification
      const res = await fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${cachedToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        localStorage.removeItem("teensphere_token");
      }
    } catch (e) {
      console.error("Session restoration error", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthenticated = (user: User, token: string) => {
    localStorage.setItem("teensphere_token", token);
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    
    // Auto route to dashboard on login success
    setCurrentTab("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("teensphere_token");
    setCurrentUser(null);
    setCurrentTab("home");
  };

  // Callback to award XP for specific action completions (mindfulness, CBT, affirmations)
  const handleAwardXP = async (activityId: string, category: string, xpReward: number) => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/activities/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.id}`
        },
        body: JSON.stringify({ activityId, category, xpReward })
      });

      if (res.ok) {
        const data = await res.json();
        // Update user state dynamically (leveling up XP, streaks)
        setCurrentUser(data.user);
      }
    } catch (e) {
      console.error("Failed to sync activity XP logs", e);
    }
  };

  const handleUpdateUserManual = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  return (
    <div id="teensphere-layout-wrapper" className="min-h-screen bg-[#07080f] text-gray-200 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      {/* BACKGROUND GRAPHIC ORBITS */}
      <div className="fixed overflow-hidden -z-20 top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#6B4FA0]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-[#5582A8]/5 rounded-full blur-3xl" />
      </div>

      <div>
        {/* NAV HEADER */}
        <Navigation 
          currentUser={currentUser} 
          currentTab={currentTab} 
          setTab={setCurrentTab} 
          openAuthModal={() => setIsAuthModalOpen(true)} 
          handleLogout={handleLogout} 
        />

        {/* CONTAINER STAGE VIEWS */}
        <main className="flex-1 min-h-[calc(100vh-210px)] pb-12">
          {loading ? (
            <div className="py-32 text-center text-xs text-indigo-400">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto mb-3" />
              Verifying security session...
            </div>
          ) : (
            <div className="animate-fade-in">
              {currentTab === "home" && (
                <HomeView 
                  currentUser={currentUser} 
                  setTab={setCurrentTab} 
                  openAuthModal={() => setIsAuthModalOpen(true)} 
                />
              )}
              {currentTab === "guidance" && (
                <GuidanceView 
                  currentUser={currentUser} 
                  onLogActivity={handleAwardXP}
                  openAuthModal={() => setIsAuthModalOpen(true)} 
                />
              )}
              {currentTab === "mood" && (
                <MoodCenter 
                  currentUser={currentUser} 
                  onCheckInCompleted={handleUpdateUserManual} 
                />
              )}
              {currentTab === "activities" && (
                <ActivitiesHub 
                  currentUser={currentUser} 
                  onLogActivity={handleAwardXP} 
                  onUpdateUser={handleUpdateUserManual}
                />
              )}
              {currentTab === "support" && (
                <SupportCenter />
              )}
              {currentTab === "dashboard" && (
                <DashboardView 
                  currentUser={currentUser} 
                  onUpdateUser={handleUpdateUserManual} 
                  setTab={setCurrentTab}
                />
              )}
              {currentTab === "admin" && (
                <AdminPanel currentUser={currentUser} />
              )}
            </div>
          )}
        </main>
      </div>

      {/* PERSISTENT AI COMPANION FLOATING PANEL */}
      <BuddyBot 
        currentUser={currentUser} 
        openAuthModal={() => setIsAuthModalOpen(true)} 
      />

      {/* COMPACT CLEAN FOOTER (NO CLUTTER) */}
      <footer id="teensphere-footer" className="bg-[#030409] border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
            <TeenSphereLogo className="scale-75 origin-left" />
            <span>© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-x-6 text-[11px] font-mono text-gray-500">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#5582A8]" /> Confidentially Encrypted</span>
            <span className="flex items-center gap-1">🔒 Fully Anonymous Logs</span>
          </div>
        </div>
      </footer>

      {/* REGISTRATION MODAL */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleAuthenticated} 
      />

    </div>
  );
}
