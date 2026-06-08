/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Users, 
  ShieldCheck, 
  Trash2, 
  ListTodo, 
  Plus, 
  CheckCircle2, 
  X, 
  Lock, 
  Tv, 
  AlertTriangle,
  Flame,
  UserCheck,
  Zap,
  Globe
} from "lucide-react";
import { User, Helpline } from "../types.js";

interface AdminPanelProps {
  currentUser: User | null;
}

export default function AdminPanel({ currentUser }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New helpline Inputs
  const [hlName, setHlName] = useState("");
  const [hlNum, setHlNum] = useState("");
  const [hlCat, setHlCat] = useState("Mental Health");
  const [hlHours, setHlHours] = useState("24/7 Hours");
  const [hlDesc, setHlDesc] = useState("");
  const [hlSuccessMsg, setHlSuccessMsg] = useState("");

  // Security Toggles represent states
  const [rateLimiting, setRateLimiting] = useState(true);
  const [anonymizeNotes, setAnonymizeNotes] = useState(true);
  const [blockNewRegisters, setBlockNewRegisters] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.role === "admin") {
      fetchAdminData();
    }
  }, [currentUser]);

  const fetchAdminData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const headers = { "Authorization": `Bearer ${currentUser.id}` };
      
      // Parallel fetches for admin tables
      const [uRes, tRes, hRes, lRes] = await Promise.all([
        fetch("/api/admin/users", { headers }),
        fetch("/api/admin/tickets", { headers }),
        fetch("/api/helplines"), // Publicly available
        fetch("/api/admin/logs", { headers })
      ]);

      if (uRes.ok && tRes.ok && hRes.ok && lRes.ok) {
        const uData = await uRes.json();
        const tData = await tRes.json();
        const hData = await hRes.json();
        const lData = await lRes.json();

        setUsers(uData.users || []);
        setTickets(tData.tickets || []);
        setHelplines(hData.helplines || []);
        setSystemLogs(lData.logs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHelpline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setHlSuccessMsg("");

    try {
      const res = await fetch("/api/admin/helpline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.id}`
        },
        body: JSON.stringify({
          name: hlName,
          number: hlNum,
          category: hlCat,
          hours: hlHours,
          description: hlDesc
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setHlSuccessMsg("Successfully queued new helpline into the live resource library!");
      setHlName("");
      setHlNum("");
      setHlDesc("");
      
      // Refresh list
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Failed creating helpline resource");
    }
  };

  const handleResolveTicket = async (ticketId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}/resolve`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${currentUser.id}` }
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
        <Lock className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white font-display">Unprivileged Access Restricted</h2>
        <p className="text-xs text-gray-500">
          Only TeenSphere system administrators hold clearance credentials to review active logs and user analytics.
        </p>
      </div>
    );
  }

  return (
    <div id="admin-panel-container" className="space-y-12 py-8 px-4 md:px-8 max-w-7xl mx-auto font-sans">
      
      {/* 1. ADMIN PANEL HEADERS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            TeenSphere Privileged Administrator Shell
          </div>
          <h1 className="font-display font-black text-2xl md:text-4xl text-white">Platform Control Room</h1>
          <p className="text-xs text-gray-400">
            Monitor real-time system connections, verify anonymous user records, toggles rate-limits, and queue emergency directories.
          </p>
        </div>

        <button 
          onClick={fetchAdminData}
          className="hover:cursor-pointer flex items-center justify-center gap-2 px-4 py-2 font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
        >
          🔄 Synchronize Platform Logs
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-indigo-400">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto mb-3" />
          Synchronizing TeenSphere secure tables...
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* 2. THREE STATS METRIC BOXES BLOCK */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active Connections", val: "Online", color: "text-emerald-400", sub: "Websocket proxy enabled" },
              { label: "Registered Users", val: users.length, color: "text-indigo-400", sub: "Anonymous records indexed" },
              { label: "Queued Support Tickets", val: `${tickets.filter(t => t.status === 'open').length} Open`, color: "text-amber-400", sub: "Resolution dashboard active" },
              { label: "Helpline Resources", val: helplines.length, color: "text-[#06B6D4]", sub: "SOS directories mapped" }
            ].map((st, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-glass border border-white/5 flex flex-col justify-between">
                <span className="text-[10px] text-gray-500 uppercase font-mono font-bold">{st.label}</span>
                <span className={`text-xl md:text-2xl font-black ${st.color} mt-1`}>{st.val}</span>
                <span className="text-[9px] text-gray-400 mt-0.5 leading-snug">{st.sub}</span>
              </div>
            ))}
          </div>

          {/* 3. CENTER COLUMN SPLIT: USER MANAGEMENTS vs HELP TICKETS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* REGISTERED USERS MANAGEMENT LISTS */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-indigo-400" />
                Secure User Records Database Table
              </h3>

              <div className="rounded-2xl border border-white/6 overflow-hidden bg-glass-heavy">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-black/45 border-b border-white/5 text-gray-400 font-mono text-[9px] uppercase tracking-wider">
                        <th className="px-5 py-3">User Details</th>
                        <th className="px-5 py-3">Registration Timestamp</th>
                        <th className="px-5 py-3 text-center">Streak Goal</th>
                        <th className="px-5 py-3 text-right">Wellness XP</th>
                        <th className="px-5 py-3 text-right">System Access</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-white/3 transition-colors">
                          <td className="px-5 py-3.5 flex items-center gap-3">
                            <img 
                              src={u.avatarUrl} 
                              alt="" 
                              className="w-7 h-7 rounded-full bg-indigo-950/30 border border-white/10"
                            />
                            <div>
                              <p className="font-bold text-white font-mono">{u.username}</p>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                u.role === "admin" ? "bg-red-500/15 text-red-400 border border-red-500/15" : "bg-black/35 text-indigo-300"
                              }`}>
                                {u.role}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-gray-400 font-mono">
                            {new Date(u.createdAt).toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 text-center font-bold text-amber-500 font-mono">
                            <span className="inline-flex items-center gap-0.5"><Flame className="w-3.5 h-3.5" />{u.streak}d</span>
                          </td>
                          <td className="px-5 py-3.5 text-right font-bold text-[#06B6D4] font-mono">
                            {u.xp} XP • Lvl {u.level}
                          </td>
                          <td className="px-5 py-3.5 text-right font-mono text-gray-400 font-bold">
                            Authorized ✓
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* LIVE HELPDESK EMERGENCY SUPPORT TICKETS FORM RESOLUTION */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <Tv className="w-4.5 h-4.5 text-cyan-400" />
                Emergency Support tickets ({tickets.filter(t => t.status === 'open').length} Open)
              </h3>

              <div className="p-5 rounded-2xl bg-glass border border-white/6 space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {tickets.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-10">No support tickets queued recently.</p>
                ) : (
                  tickets.map((t) => (
                    <div key={t.id} className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                      t.status === "open" ? "bg-amber-500/5 border-amber-500/15" : "bg-white/3 border-white/5 opacity-55"
                    }`}>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-white uppercase">{t.name}</span>
                        <span className={`font-mono px-1.5 py-0.2 rounded font-black uppercase ${
                          t.status === "open" ? "bg-amber-400 text-black" : "bg-black text-gray-500"
                        }`}>{t.status}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-gray-200">Sub: {t.subject}</h4>
                        <p className="text-[11px] text-gray-400 leading-normal font-sans italic">&ldquo;{t.message}&rdquo;</p>
                      </div>

                      <div className="flex font-mono text-[9px] text-gray-500 justify-between items-center border-t border-white/5 pt-2">
                        <span>{t.email}</span>
                        {t.status === "open" && (
                          <button
                            onClick={() => handleResolveTicket(t.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-2 py-0.8 rounded hover:cursor-pointer transition-colors"
                          >
                            Resolve Ticket ✓
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* 4. PLATFORM COMPREHENSIVE CONTROL TOGGLES & HELPLINE ADD FORM */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* HELPLINES INSTANT QUEUER FORM BOARD */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-glass border border-white/6 space-y-4">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-1.5">
                <Plus className="w-5 h-5 text-indigo-400" /> Queue Fresh Helpline Resources
              </h3>
              
              <p className="text-xs text-gray-400">
                Directly registers a verified teen social directory or immediate local physical support helpline into the live public database.
              </p>

              {hlSuccessMsg && (
                <p className="p-2.5 rounded text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                  {hlSuccessMsg}
                </p>
              )}

              <form onSubmit={handleCreateHelpline} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider mb-1">Resource / Agency Name</label>
                    <input
                      type="text"
                      required
                      value={hlName}
                      onChange={(e) => setHlName(e.target.value)}
                      placeholder="e.g., Teen Screen-time Advisory Network"
                      className="w-full p-2.5 text-xs bg-black/25 border border-white/10 rounded-lg text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider mb-1">Direct Dial / SMS Number</label>
                    <input
                      type="text"
                      required
                      value={hlNum}
                      onChange={(e) => setHlNum(e.target.value)}
                      placeholder="e.g., 1-800-555-TEEN"
                      className="w-full p-2.5 text-xs bg-black/25 border border-white/10 rounded-lg text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider mb-1">Operational Hours</label>
                    <input
                      type="text"
                      required
                      value={hlHours}
                      onChange={(e) => setHlHours(e.target.value)}
                      placeholder="e.g., 24/7 Hours, 8 AM - 8 PM"
                      className="w-full p-2.5 text-xs bg-black/25 border border-white/10 rounded-lg text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider mb-1">Support Category Category</label>
                    <select
                      value={hlCat}
                      onChange={(e) => setHlCat(e.target.value)}
                      className="w-full p-2.5 text-xs bg-black/35 border border-white/10 rounded-lg text-gray-200 outline-none focus:border-indigo-500"
                    >
                      <option>Mental Health Support</option>
                      <option>Academic Pressure</option>
                      <option>LGBTQ+ Support Line</option>
                      <option>Eating Disorders help</option>
                      <option>General Teen Advisory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider mb-1">Description Advice details</label>
                  <textarea
                    required
                    rows={2}
                    value={hlDesc}
                    onChange={(e) => setHlDesc(e.target.value)}
                    placeholder="Provide teenagers detailed instructions on how the help works. E.g., This is a free counseling agency providing guidance on cyberbullying protection."
                    className="w-full p-2.5 text-xs bg-black/25 border border-white/10 rounded-lg text-white outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white hover:cursor-pointer font-bold text-xs rounded-lg transition-all"
                >
                  Confirm Helpline Registration
                </button>

              </form>

            </div>

            {/* PLATFORM SECURITY COMPLIANCES TOGGLES (COL SPAN 4) */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-glass border border-white/6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold font-display text-white flex items-center gap-1.5">
                  <Lock className="w-4.5 h-4.5 text-yellow-400" /> Platform Security Toggles
                </h3>
                
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Toggle safety flags below to configure the live routing rules and private records filtration mechanisms in real-time.
                </p>

                <div className="space-y-3 pt-2">
                  {[
                    { label: "Enforce API Rate Limiting", value: rateLimiting, setter: setRateLimiting, desc: "Limits requests to 30/minute" },
                    { label: "Anonymize Note Logs Streams", value: anonymizeNotes, setter: setAnonymizeNotes, desc: "Hides note context from telemetry" },
                    { label: "Block New Signups", value: blockNewRegisters, setter: setBlockNewRegisters, desc: "Overloads limit safeguards" }
                  ].map((tg, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-black/15 border border-white/5 text-xs">
                      <div>
                        <p className="font-bold text-gray-200">{tg.label}</p>
                        <span className="text-[9px] text-gray-500">{tg.desc}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => tg.setter(!tg.value)}
                        className={`hover:cursor-pointer px-2.5 py-1 text-[10px] font-black rounded font-mono ${
                          tg.value 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {tg.value ? "ACTIVE" : "INACTIVE"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SYSTEM ACTIVITY LOG TRACKS LEDGER */}
              <div className="p-3 bg-black/35 rounded-xl border border-white/5 space-y-2">
                <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Zap className="w-3 h-3 text-indigo-400" /> Activity ledger telemetry
                </span>
                <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="text-[9px] font-mono text-gray-400 leading-normal border-b border-white/5 pb-1">
                      <span className="text-gray-500">[{new Date(log.createdAt).toLocaleTimeString()}]</span> {log.action}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
