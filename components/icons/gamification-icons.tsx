'use client';

import React from 'react';

// Gamification Icons for Sport Club de Natal

// XP Icon
export const XPIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle cx="12" cy="12" r="10" fill="url(#xp-gradient)" stroke="#FFD700" strokeWidth="2" />
        <path
            d="M8 8L12 12L16 8M8 16L12 12L16 16"
            stroke="#0A0A0A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <defs>
            <linearGradient id="xp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" stopOpacity={1} />
                <stop offset="100%" stopColor="#DC2626" stopOpacity={1} />
            </linearGradient>
        </defs>
    </svg>
);

// Level Badge Icon
export const LevelBadgeIcon = ({ level = 1 }: { level?: number }) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="url(#badge-gradient)"
            stroke="#FFD700"
            strokeWidth="1.5"
        />
        <text x="12" y="14" textAnchor="middle" fill="#0A0A0A" fontSize="8" fontWeight="bold">{level}</text>
        <defs>
            <linearGradient id="badge-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" stopOpacity={1} />
                <stop offset="50%" stopColor="#FFA500" stopOpacity={1} />
                <stop offset="100%" stopColor="#FFD700" stopOpacity={1} />
            </linearGradient>
        </defs>
    </svg>
);

// Streak Fire Icon
export const StreakIcon = ({ days = 1 }: { days?: number }) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path
            d="M12 2C12 2 8 6 8 11C8 14.31 10.69 17 14 17C17.31 17 20 14.31 20 11C20 6 16 2 16 2C16 2 15 4 12 4C9 4 12 2 12 2Z"
            fill="url(#fire-gradient)"
            stroke="#DC2626"
            strokeWidth="1"
        />
        <path
            d="M12 4C12 4 10 7 10 10C10 12 11.34 13 13 13C14.66 13 16 12 16 10C16 7 14 4 14 4C14 4 13.5 5.5 12 5.5C10.5 5.5 12 4 12 4Z"
            fill="#FFD700"
            opacity="0.8"
        />
        <defs>
            <linearGradient id="fire-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" stopOpacity={1} />
                <stop offset="50%" stopColor="#FF6B00" stopOpacity={1} />
                <stop offset="100%" stopColor="#DC2626" stopOpacity={1} />
            </linearGradient>
        </defs>
    </svg>
);

// Trophy Achievement Icon
export const TrophyIcon = ({ place = 1 }: { place?: number }) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path
            d="M7 4H17V8C17 10.76 14.76 13 12 13C9.24 13 7 10.76 7 8V4Z"
            fill="url(#trophy-gradient)"
            stroke="#FFD700"
            strokeWidth="1.5"
        />
        <path d="M7 4H5C4.45 4 4 4.45 4 5V7C4 8.1 4.9 9 6 9H7V4Z" fill="#FFD700" opacity="0.6" />
        <path d="M17 4H19C19.55 4 20 4.45 20 5V7C20 8.1 19.1 9 18 9H17V4Z" fill="#FFD700" opacity="0.6" />
        <rect x="10" y="13" width="4" height="5" fill="#FFD700" />
        <rect x="8" y="18" width="8" height="2" rx="1" fill="#FFD700" />
        <text x="12" y="9.5" textAnchor="middle" fill="#0A0A0A" fontSize="6" fontWeight="bold">{place}</text>
        <defs>
            <linearGradient id="trophy-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" stopOpacity={1} />
                <stop offset="100%" stopColor="#B8860B" stopOpacity={1} />
            </linearGradient>
        </defs>
    </svg>
);

// Boat Type Icons
export const SingleSkiffIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M2 12H22" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="12" cy="12" rx="8" ry="2" fill="url(#boat-gradient)" />
        <circle cx="12" cy="10" r="1.5" fill="#FFD700" />
        <defs>
            <linearGradient id="boat-gradient">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
        </defs>
    </svg>
);

export const DoubleSkiffIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M2 12H22" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="12" cy="12" rx="9" ry="2.5" fill="url(#boat-gradient-double)" />
        <circle cx="9" cy="10" r="1.5" fill="#FFD700" />
        <circle cx="15" cy="10" r="1.5" fill="#FFD700" />
        <defs>
            <linearGradient id="boat-gradient-double">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
        </defs>
    </svg>
);

export const EightCoxIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path d="M1 12H23" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="12" cy="12" rx="11" ry="3" fill="url(#boat-gradient-eight)" />
        {[4, 7, 10, 13, 16, 19].map((x, i) => (
            <circle key={i} cx={x} cy="10" r="1" fill="#FFD700" />
        ))}
        <circle cx="22" cy="10" r="1.5" fill="#FFD700" stroke="#0A0A0A" strokeWidth="0.5" />
        <defs>
            <linearGradient id="boat-gradient-eight">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="50%" stopColor="#7F1D1D" />
                <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
        </defs>
    </svg>
);
