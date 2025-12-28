'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'visitante' | 'socio' | 'treinador' | 'diretoria';

interface UserContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
    isAtLeast: (minRole: UserRole) => boolean;
}

const roleHierarchy: UserRole[] = ['visitante', 'socio', 'treinador', 'diretoria'];

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<UserRole>('visitante');

    const isAtLeast = (minRole: UserRole): boolean => {
        const currentIndex = roleHierarchy.indexOf(role);
        const minIndex = roleHierarchy.indexOf(minRole);
        return currentIndex >= minIndex;
    };

    return (
        <UserContext.Provider value={{ role, setRole, isAtLeast }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
