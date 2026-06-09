// /**
//  * @license
//  * SPDX-License-Identifier: Apache-2.0
//  */

// import React from "react";

// interface LogoProps {
//   className?: string;
// }

// export default function TeenSphereLogo({ className = "" }: LogoProps) {
//   return (
//     <div className={`flex items-center select-none ${className}`}>
//       {/* FUTURISTIC NEON INTERCONNECTED ECOSYSTEM ICON - ENLARGED */}
//       <div className="relative shrink-0 flex items-center justify-center w-16 h-16 md:w-20 md:h-20">
//         <svg
//           viewBox="0 0 100 100"
//           className="w-full h-full filter drop-shadow-[0_0_12px_rgba(107,79,160,0.6)]"
//           fill="none"
//           xmlns=""
//         >
//           {/* Neon glow definitions */}
//           <defs>
//             <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//               <stop offset="0%" stopColor="#6B4FA0" />
//               <stop offset="100%" stopColor="#8A6EC2" />
//             </linearGradient>
//             <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//               <stop offset="0%" stopColor="#5582A8" />
//               <stop offset="100%" stopColor="#06B6D4" />
//             </linearGradient>
//             <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
//               <feGaussianBlur stdDeviation="2" result="blur" />
//               <feMerge>
//                 <feMergeNode in="blur" />
//                 <feMergeNode in="SourceGraphic" />
//               </feMerge>
//             </filter>
//           </defs>

//           {/* Connected Curved Network Strands (Ecosystem Pathways) */}
//           <path
//             d="M 12 50 C 30 50, 30 35, 45 42"
//             stroke="url(#purpleGradient)"
//             strokeWidth="1.5"
//             strokeLinecap="round"
//             opacity="0.85"
//             filter="url(#neonGlow)"
//           />
//           <path
//             d="M 12 50 C 30 50, 30 65, 45 58"
//             stroke="url(#cyanGradient)"
//             strokeWidth="1.5"
//             strokeLinecap="round"
//             opacity="0.85"
//             filter="url(#neonGlow)"
//           />

//           <path
//             d="M 88 50 C 70 50, 70 35, 55 42"
//             stroke="url(#purpleGradient)"
//             strokeWidth="1.5"
//             strokeLinecap="round"
//             opacity="0.85"
//             filter="url(#neonGlow)"
//           />
//           <path
//             d="M 88 50 C 70 50, 70 65, 55 58"
//             stroke="url(#cyanGradient)"
//             strokeWidth="1.5"
//             strokeLinecap="round"
//             opacity="0.85"
//             filter="url(#neonGlow)"
//           />

//           {/* Left and Right Connection Nodes */}
//           <circle cx="12" cy="50" r="3.5" fill="#6B4FA0" filter="url(#neonGlow)" />
//           <circle cx="88" cy="50" r="3.5" fill="#5582A8" filter="url(#neonGlow)" />

//           {/* Left top node (Mindfulness) & bottom node (Growth) */}
//           <circle cx="28" cy="38" r="2" fill="#5582A8" opacity="0.9" />
//           <circle cx="28" cy="62" r="2" fill="#6B4FA0" opacity="0.9" />

//           {/* Right top node (Learning) & bottom node (Sleep) */}
//           <circle cx="72" cy="38" r="2" fill="#6B4FA0" opacity="0.9" />
//           <circle cx="72" cy="62" r="2" fill="#5582A8" opacity="0.9" />

//           {/* Central Devices Bridge: Smartphone */}
//           <rect
//             x="42"
//             y="26"
//             width="16"
//             height="32"
//             rx="3"
//             stroke="url(#purpleGradient)"
//             strokeWidth="2.5"
//             fill="#07080f"
//             filter="url(#neonGlow)"
//           />
//           {/* Phone Speaker & Camera punch */}
//           <line x1="48" y1="29" x2="52" y2="29" stroke="#6B4FA0" strokeWidth="1" strokeLinecap="round" />
          
//           {/* Overlapping VR Headset (The unique immersive tech element from logo) */}
//           <path
//             d="M 33 42 H 49 C 52 42, 54 44, 54 46 V 51 C 54 53, 52 55, 49 55 H 33 C 30 55, 28 53, 28 51 V 46 C 28 44, 30 42, 33 42 Z"
//             fill="#030409"
//             stroke="url(#cyanGradient)"
//             strokeWidth="2"
//             filter="url(#neonGlow)"
//           />
//           <path
//             d="M 38 42 L 35 34 A 4 4 0 0 1 43 34"
//             stroke="#06B6D4"
//             strokeWidth="1.2"
//             strokeLinecap="round"
//             fill="none"
//           />
//           {/* VR strap */}
//           <path
//             d="M 28 48 C 24 48, 20 54, 28 54"
//             stroke="#5582A8"
//             strokeWidth="1"
//             fill="none"
//           />

//           {/* Center Connector Ring / Orbit Overlay */}
//           <circle
//             cx="50"
//             cy="42"
//             r="11"
//             stroke="#ffffff"
//             strokeWidth="1"
//             strokeDasharray="4 2"
//             opacity="0.4"
//           />

//           {/* Tiny glowing stars/sparkles around ecosystem */}
//           <polygon points="56,20 57.5,22 60,22.5 57.5,23 56,25 54.5,23 52,22.5 54.5,22" fill="#e0f1fe" opacity="0.8" />
//           <polygon points="32,68 33,69 35,69.5 33,70 32,71 31,70 29,69.5 31,69" fill="#b5a0d9" opacity="0.8" />
//         </svg>

//         {/* Pulse effect rings behind/around */}
//         <div className="absolute inset-0 bg-[#6B4FA0]/10 rounded-full blur-[8px] animate-pulse" />
//       </div>

//     </div>
//   );
// }
import React from 'react'

const TeenSphereLogo = () => {
  return (
    <div>
      <img src="https://res.cloudinary.com/dzz8f9uov/image/upload/Gemini_Generated_Image_4j58ee4j58ee4j58_osg9jd" alt="Logo" height="150px" width="220px" />
    </div>
  )
}

export default TeenSphereLogo
