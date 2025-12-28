'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface DropdownMenuProps {
    menu: {
        label: string;
        dropdown: Array<{ href: string; label: string }>;
    };
}

export function DropdownMenu({ menu }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const isActive = menu.dropdown.some(item => pathname === item.href);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className={cn(
                    'flex items-center gap-1 text-sm font-medium transition-colors hover:text-club-gold',
                    isActive ? 'text-club-gold' : 'text-white/70'
                )}
            >
                {menu.label}
                <ChevronDown className={cn(
                    'w-4 h-4 transition-transform',
                    isOpen && 'rotate-180'
                )} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-club-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                        {menu.dropdown.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'block px-4 py-3 text-sm transition-colors',
                                    pathname === item.href
                                        ? 'bg-club-red/20 text-club-gold'
                                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
