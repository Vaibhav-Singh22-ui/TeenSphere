/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { User, UserRole } from "../types.js";
import TeenSphereLogo from "./TeenSphereLogo.js";
import { 
  Heart, 
  Sparkles, 
  Activity, 
  MessageSquare, 
  ShieldAlert, 
  LogOut, 
  LogIn, 
  User as UserIcon, 
  Home, 
  BookOpen, 
  LifeBuoy,
  Flame,
  Award
} from "lucide-react";

interface NavigationProps {
  currentUser: User | null;
  currentTab: string;
  setTab: (tab: string) => void;
  openAuthModal: () => void;
  handleLogout: () => void;
}

export default function Navigation({ 
  currentUser, 
  currentTab, 
  setTab, 
  openAuthModal, 
  handleLogout 
}: NavigationProps) {

  // Calculate XP Progress
  const xpNeeded = currentUser ? currentUser.level * 100 : 100;
  const progressPercent = currentUser ? Math.min(100, (currentUser.xp / xpNeeded) * 100) : 0;

  return (
    <header id="ts-header" className="sticky top-0 z-50 w-full bg-glass border-b border-white/6 px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <div 
          id="ts-logo"
          onClick={() => setTab("home")} 
          className="cursor-pointer group flex items-center"
        >
          <TeenSphereLogo className="group-hover:scale-[1.02] transition-transform duration-200" />
        </div>

        {/* MAIN NAVIGATION DESKTOP */}
        <nav className="hidden lg:flex items-center gap-1.5 text-sm">
          <button
            id="nav-home"
            onClick={() => setTab("home")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
              currentTab === "home" 
                ? "bg-indigo-500/10 text-[#cbd5e1] border border-indigo-500/20" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>

          <button
            id="nav-guidance"
            onClick={() => setTab("guidance")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
              currentTab === "guidance" 
                ? "bg-indigo-500/10 text-[#cbd5e1] border border-indigo-500/20" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Guidance Library
          </button>

          <button
            id="nav-support"
            onClick={() => setTab("support")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
              currentTab === "support" 
                ? "bg-indigo-500/10 text-[#cbd5e1] border border-indigo-500/20" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            Support & FAQs
          </button>

          {currentUser && (
            <>
              <button
                id="nav-mood"
                onClick={() => setTab("mood")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentTab === "mood" 
                    ? "bg-indigo-500/10 text-[#cbd5e1] border border-indigo-500/20" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Activity className="w-4 h-4" />
                Mood Hub
              </button>

              <button
                id="nav-activities"
                onClick={() => setTab("activities")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentTab === "activities" 
                    ? "bg-indigo-500/10 text-[#cbd5e1] border border-indigo-500/20" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Activities Hub
              </button>

              <button
                id="nav-dashboard"
                onClick={() => setTab("dashboard")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentTab === "dashboard" 
                    ? "bg-indigo-500/10 text-[#cbd5e1] border border-indigo-500/20" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <UserIcon className="w-4 h-4" />
                Dashboard
              </button>

              {currentUser.role === UserRole.ADMIN && (
                <button
                  id="nav-admin"
                  onClick={() => setTab("admin")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium bg-red-500/5 text-red-400 border border-red-500/10 hover:bg-red-500/15 transition-colors`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  Admin Office
                </button>
              )}
            </>
          )}
        </nav>

        {/* RIGHT SIDE PROFILE / AUTHENTICATION */}
        <div className="flex items-center gap-3">
          
          {/* CRITICAL SOS DIRECTIVE HELPLINE BUTTON */}
          <button
            id="nav-sos-button"
            onClick={() => setTab("support")}
            className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white hover:from-red-500 hover:to-amber-500 shadow-md shadow-red-900/30 transition-all hover:scale-[1.02]"
          >
            <ShieldAlert className="w-3.5 h-3.5 md:w-4 md:h-4 animate-bounce" />
            <span className="hidden sm:inline">SOS: SOS Get Help Now</span>
            <span className="sm:hidden">Get Help</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* STREAK */}
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-mono text-xs">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{currentUser.streak}d streak</span>
              </div>

              {/* LEVEL STATUS (SaaS Badge) */}
              <div className="hidden md:block text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-bold font-display text-[#e2e8f0]">Level {currentUser.level}</span>
                </div>
                <div className="w-24 bg-gray-800 h-1.5 rounded-full mt-1 overflow-hidden border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-300" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* USER PIC */}
              <div 
                id="nav-profile-menu"
                onClick={() => setTab("dashboard")}
                className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-white/5 transition-colors group"
                title="Go to Dashboard"
              >
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.username} 
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-indigo-500/40 bg-indigo-900/30 object-cover"
                />
                <span className="text-xs font-medium text-gray-300 group-hover:text-white hidden max-w-[80px] truncate sm:inline-block">
                  {currentUser.username}
                </span>
              </div>

              {/* LOGOUT */}
              <button
                id="nav-logout-btn"
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="nav-login-btn"
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-4 py-2 hover:cursor-pointer text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/10 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login / Sign Up
            </button>
          )}
        </div>
      </div>

      {/* MOBILE LOWER NAV TAB BAR */}
      <div className="lg:hidden flex justify-around border-t border-white/5 mt-3 pt-2 text-xs">
        <button 
          onClick={() => setTab("home")} 
          className={`flex flex-col items-center gap-0.5 ${currentTab === "home" ? "text-indigo-400" : "text-gray-400"}`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button 
          onClick={() => setTab("guidance")} 
          className={`flex flex-col items-center gap-0.5 ${currentTab === "guidance" ? "text-indigo-400" : "text-gray-400"}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Guides</span>
        </button>
        {currentUser ? (
          <>
            <button 
              onClick={() => setTab("mood")} 
              className={`flex flex-col items-center gap-0.5 ${currentTab === "mood" ? "text-indigo-400" : "text-gray-400"}`}
            >
              <Activity className="w-4 h-4" />
              <span>Mood</span>
            </button>
            <button 
              onClick={() => setTab("activities")} 
              className={`flex flex-col items-center gap-0.5 ${currentTab === "activities" ? "text-indigo-400" : "text-gray-400"}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Activities</span>
            </button>
            <button 
              onClick={() => setTab("dashboard")} 
              className={`flex flex-col items-center gap-0.5 ${currentTab === "dashboard" ? "text-indigo-400" : "text-gray-400"}`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </>
        ) : (
          <button 
            onClick={openAuthModal} 
            className="flex flex-col items-center gap-0.5 text-indigo-400"
          >
            <LogIn className="w-4 h-4" />
            <span>Join</span>
          </button>
        )}
      </div>
    </header>
  );
}
