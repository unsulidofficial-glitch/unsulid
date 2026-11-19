'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOtpModalOpen: boolean;
  destination: string | null;
  openOtpModal: (dest?: string) => void;
  closeOtpModal: () => void;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string; devOtp?: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [destination, setDestination] = useState<string | null>(null);
  const router = useRouter();

  // Check current session on mount
  useEffect(() => {
    let mounted = true;
    api.auth
      .me()
      .then((res) => {
        if (mounted && res?.user) {
          setUser(res.user);
        }
      })
      .catch(() => {
        // Not authenticated
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const openOtpModal = useCallback((dest?: string) => {
    if (dest) setDestination(dest);
    setIsOtpModalOpen(true);
  }, []);

  const closeOtpModal = useCallback(() => {
    setIsOtpModalOpen(false);
  }, []);

  const sendOtp = useCallback(async (phone: string) => {
    const res = await api.auth.sendOtp(phone);
    return res;
  }, []);

  const verifyOtp = useCallback(
    async (phone: string, otp: string): Promise<boolean> => {
      const res = await api.auth.verifyOtp(phone, otp);
      if (res?.user) {
        setUser(res.user);
        setIsOtpModalOpen(false);

        // If there was an intended checkout or destination page, navigate there
        if (destination) {
          const dest = destination;
          setDestination(null);
          router.push(dest);
        }
        return true;
      }
      return false;
    },
    [destination, router]
  );

  const updateProfile = useCallback(async (data: { name?: string; email?: string }) => {
    const res = await api.auth.updateProfile(data);
    if (res?.user) {
      setUser((prev) => (prev ? { ...prev, ...res.user } : res.user));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } finally {
      setUser(null);
      router.push('/');
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isOtpModalOpen,
        destination,
        openOtpModal,
        closeOtpModal,
        sendOtp,
        verifyOtp,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

