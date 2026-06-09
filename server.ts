/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { db } from "./src/server/db.js";
import { GoogleGenAI } from "@google/genai";
import { UserRole } from "./src/types.js";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Setup Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Gemini chat features will fall back to smart simulated responses.");
}

app.use(express.json());

// Token Authentication Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: Bearer <userId>

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  const user = db.getUserById(token);
  if (!user) {
    return res.status(403).json({ error: "Invalid session token" });
  }

  req.user = user;
  next();
};

// Admin Authentication Middleware
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({ error: "Admin access privileges required" });
  }
  next();
};

// --- AUTHENTICATION ENDPOINTS ---

app.post("/api/auth/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Please complete all fields" });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: "An account with this email already exists" });
  }

  try {
    const user = db.createUser(username, email, password);
    res.status(201).json({ token: user.id, user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create user account" });
  }
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "No account found with this email" });
  }

  const valid = db.verifyUserPassword(email, password);
  if (!valid) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  // Set streak on login
  db.updateUserStreak(user.id);

  res.json({ token: user.id, user });
});

app.get("/api/auth/me", authenticateToken, (req: any, res) => {
  res.json({ user: req.user });
});

// --- MOOD TRACKING ENDPOINTS ---

app.get("/api/moods", authenticateToken, (req: any, res) => {
  const entries = db.getMoodEntries(req.user.id);
  res.json({ entries });
});

app.post("/api/moods", authenticateToken, (req: any, res) => {
  const { moodValue, emotions, notes, activities } = req.body;

  if (typeof moodValue !== "number" || moodValue < 1 || moodValue > 5) {
    return res.status(400).json({ error: "Mood rating must be a score between 1 and 5" });
  }

  if (!Array.isArray(emotions) || emotions.length === 0) {
    return res.status(400).json({ error: "Please select at least one feeling/emotion" });
  }

  try {
    const entry = db.addMoodEntry(req.user.id, moodValue, emotions, notes || "", activities || []);
    // Send updated user statistics with new XP levels
    const updatedUser = db.getUserById(req.user.id);
    res.status(201).json({ entry, user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to add mood check-in" });
  }
});

// --- JOURNAL & GRATITUDE ENDPOINTS ---

app.get("/api/journal", authenticateToken, (req: any, res) => {
  const entries = db.getJournalEntries(req.user.id);
  res.json({ entries });
});

app.post("/api/journal", authenticateToken, (req: any, res) => {
  const { title, content, moodRating } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and journal content are required" });
  }

  try {
    const entry = db.addJournalEntry(req.user.id, title, content, moodRating || 3);
    const updatedUser = db.getUserById(req.user.id);
    res.status(201).json({ entry, user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to save journal prompt" });
  }
});

// --- ACTIVITIES TRACKING ENDPOINTS ---

app.post("/api/activities", authenticateToken, (req: any, res) => {
  const { activityId, type, xpReward } = req.body;

  if (!activityId || !type) {
    return res.status(400).json({ error: "Activity details missing" });
  }

  try {
    const earnedXP = xpReward || 15;
    const progress = db.addActivityProgress(req.user.id, activityId, type, earnedXP);
    const updatedUser = db.getUserById(req.user.id);
    res.status(201).json({ progress, user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to save activity accomplishment" });
  }
});

// --- HELPLINES ENDPOINTS ---

app.get("/api/helplines", (req, res) => {
  res.json({ helplines: db.getHelplines() });
});

app.post("/api/helplines", authenticateToken, requireAdmin, (req, res) => {
  const { name, number, category, hours, description } = req.body;

  if (!name || !number || !category) {
    return res.status(400).json({ error: "Helpline missing configuration elements" });
  }

  try {
    const helpline = db.addHelpline(name, number, category, hours || "24/7", description || "");
    res.status(201).json({ helpline });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to add helpline card" });
  }
});

app.delete("/api/helplines/:id", authenticateToken, requireAdmin, (req, res) => {
  const deleted = db.deleteHelpline(req.params.id);
  if (deleted) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Helpline element not found" });
  }
});

// --- SUPPORT CONTACT ENQUIRIES ---

app.post("/api/support/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Please enter all contact block details" });
  }

  try {
    const request = db.addContactRequest(name, email, subject, message);
    res.status(201).json({ success: true, request });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to forward contact form" });
  }
});

// --- GOOGLE GENAI CHAT ASSISTANT (BUDDYBOT) ---

app.post("/api/chat", async (req: any, res) => {
  const { message, chatHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message prompt is missing" });
  }

  // If Gemini API is not available/configured, fall back gracefully to supportive responses
  if (!ai) {
    const backupResponses = [
      "I hear you, and I'm right here with you! It takes a lot of strength to talk about these feelings. What else is on your mind?",
      "That sounds tough, but you are handled with safety and light. Let's research some steps together to build your confidence and focus!",
      "I'm super proud of you for checking in today! Remember, you don't have to carry everything by yourself. Have you tried doing some 4-7-8 deep breathing with me?",
      "That's a valid point. School and pressure can feel swamped sometimes. What's one quick thing we can do today to take a breather?",
      "You are worthy, capable, and doing great. I'm here to support you anytime you need a quick chat!"
    ];
    const item = backupResponses[Math.floor(Math.random() * backupResponses.length)];
    return setTimeout(() => {
      res.json({
        response: `[BuddyBot (Offline Mode)]: ${item}\n\n*Note: Complete your platform secrets setup to access the active AI engine.*`
      });
    }, 850);
  }

  try {
    const promptInstructions = 
      "You are BuddyBot, an incredibly warm, compassionate, and supportive virtual companion on TeenSphere, exclusive for teenagers navigating school pressure, confidence, and friendships.\n" +
      "CRITICAL SAFETY WARNING:\n" +
      "You are not a clinical psychologist or crisis center. If the user mentions suicide, self-harm, severe depression, abuse, or other emergencies, you MUST immediately print a prominent warning, provide the 988 Lifeline, and request them to speak to a doctor or trusted family member.\n" +
      "COACHING DIRECTIONS:\n" +
      "- Keep your responses energetic, comforting, teenage-relatable, and relatively brief (under 180 words).\n" +
      "- Suggest stress relief activities like writing in a gratitude journal, taking deep breaths, or scheduling regular breaks.\n" +
      "- Use warm greetings, friendly encouragement, and light emojis appropriately.\n";

    // Format historical messages for Gemini context
    // We represent conversation history with alternate text parts
    const contents: any[] = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.slice(-6).forEach((msgObj: any) => {
        contents.push({
          role: msgObj.role === "user" ? "user" : "model",
          parts: [{ text: msgObj.text }]
        });
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: promptInstructions,
        temperature: 0.8,
        topP: 0.9,
      }
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.error("Gemini Assistant Failure:", error);
    res.status(500).json({ 
      error: "AI engine connection failed",
      response: "Hey! My circuits got a bit tangled up there. What is of concern is your wellness, can you repeat that or should we try writing in our Journal instead?"
    });
  }
});

// --- ADMIN CONTROL & ANALYTICS ---

app.get("/api/admin/stats", authenticateToken, requireAdmin, (req, res) => {
  res.json({ stats: db.getAdminAnalytics() });
});

app.get("/api/admin/users", authenticateToken, requireAdmin, (req, res) => {
  res.json({ users: db.getUsers() });
});

app.post("/api/admin/users/:id/role", authenticateToken, requireAdmin, (req, res) => {
  const { role } = req.body;
  if (role !== "user" && role !== "admin") {
    return res.status(400).json({ error: "Invalid user role specified" });
  }
  const updated = db.moderateUserRole(req.params.id, role as UserRole);
  if (updated) {
    res.json({ success: true, users: db.getUsers() });
  } else {
    res.status(404).json({ error: "User profile not found" });
  }
});

app.delete("/api/admin/users/:id", authenticateToken, requireAdmin, (req, res) => {
  const deleted = db.deleteUser(req.params.id);
  if (deleted) {
    res.json({ success: true, users: db.getUsers() });
  } else {
    res.status(404).json({ error: "User profiles not modified" });
  }
});

app.get("/api/admin/support", authenticateToken, requireAdmin, (req, res) => {
  res.json({ requests: db.getContactRequests() });
});

app.post("/api/admin/support/:id/resolve", authenticateToken, requireAdmin, (req, res) => {
  const resolved = db.resolveContactRequest(req.params.id);
  if (resolved) {
    res.json({ success: true, requests: db.getContactRequests() });
  } else {
    res.status(404).json({ error: "Contact feedback ticket not modified" });
  }
});

// Start the core services and Vite Middleware configuration
async function startServer() {
  // Vite middleware for rendering and serving frontend files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TeenSphere Full-Stack Server listening successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer();
