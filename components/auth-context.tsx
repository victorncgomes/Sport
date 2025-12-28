'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'visitante' | 'socio' | 'atleta' | 'treinador' | 'diretoria' | 'admin';

interface AuthContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
    logout: () => void;
    isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRoleState] = useState<UserRole>('visitante');
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialize from localStorage
    useEffect(() => {
        const savedRole = localStorage.getItem('scn-user-role') as UserRole;
        if (savedRole && ['visitante', 'socio', 'atleta', 'treinador', 'diretoria', 'admin'].includes(savedRole)) {
            setRoleState(savedRole);
        }
        setIsLoaded(true);
    }, []);

    const setRole = (newRole: UserRole) => {
        setRoleState(newRole);
        localStorage.setItem('scn-user-role', newRole);
    };

    const logout = () => {
        setRoleState('visitante');
        localStorage.removeItem('scn-user-role');
        window.location.href = '/'; // Redireciona para home
    };

    return (
        <AuthContext.Provider value={{ role, setRole, logout, isLoaded }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
