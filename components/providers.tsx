'use client';

import { CartProvider } from '@/components/store/cart-context';
import { AuthProvider } from '@/components/auth-context';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </AuthProvider>
    );
}
