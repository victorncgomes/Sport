'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface MenuItem {
    href: string;
    label: string;
}

interface MobileMenuProps {
    menuItems: MenuItem[];
    pathname: string;
    onClose: () => void;
}

export function MobileMenu({ menuItems, pathname, onClose }: MobileMenuProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Menu Content */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 20 }}
                className="absolute left-0 top-0 bottom-0 w-[80%] max-w-sm bg-gradient-to-b from-black via-club-red/10 to-black border-r border-club-red/30"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header do Menu */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="font-saira-condensed text-xl font-bold text-white tracking-wider">
                        MENU
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-club-red transition-colors"
                        aria-label="Fechar menu"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="p-6">
                    <ul className="space-y-2">
                        {menuItems.map((item, index) => (
                            <motion.li
                                key={item.href}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        'block px-4 py-3 rounded-lg font-saira-condensed text-lg font-semibold tracking-wide transition-all',
                                        pathname === item.href
                                            ? 'bg-club-red text-white'
                                            : 'text-white hover:bg-white/10 hover:text-club-red'
                                    )}
                                >
                                    {item.label}
                                </Link>
                            </motion.li>
                        ))}
                    </ul>
                </nav>

                {/* Footer do Menu */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
                    <p className="text-white/50 text-xs text-center font-saira-condensed">
                        Sport Club de Natal © 2024
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
