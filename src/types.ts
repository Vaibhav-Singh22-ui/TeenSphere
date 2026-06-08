/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  USER = "user",
  ADMIN = "admin"
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  xp: number;
  level: number;
  streak: number;
  lastActive: string; // ISO string
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  moodValue: number; // 1 to 5 (Awful, Bad, Okay, Good, Excellent)
  emotions: string[]; // e.g., ["anxious", "overwhelmed", "excited", "peaceful"]
  notes?: string;
  activities: string[]; // e.g., ["exercised", "journaled", "listened_music"]
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  moodRating: number; // 1 to 5
  createdAt: string;
}

export interface ActivityProgress {
  id: string;
  userId: string;
  activityId: string; // e.g., "breathing_478", "affirmation_daily", "gratitude_log"
  type: "breathing" | "affirmation" | "journal" | "challenge";
  xpEarned: number;
  createdAt: string;
}

export interface ActiveChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  completed: boolean;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "pending" | "resolved";
  createdAt: string;
}

export interface Helpline {
  id: string;
  name: string;
  number: string;
  category: string;
  hours: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  createdAt: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  averageMood: number;
  totalActivitiesCompleted: number;
  totalJournalsWritten: number;
  totalSupportRequests: number;
  weeklyRegistrations: { day: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
}
