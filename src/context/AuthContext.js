// ─────────────────────────────────────────────────────────────────────────────
// src/context/AuthContext.js
// Fully local auth — no backend, no Firebase.
// Users stored in AsyncStorage under key 'bayo_users'.
// Session stored under 'bayo_current_user'.
// ─────────────────────────────────────────────────────────────────────────────
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

const USERS_KEY   = 'bayo_users';
const SESSION_KEY = 'bayo_current_user';

// ── Helpers ──────────────────────────────────────────────────────────────────
const getUsers = async () => {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveUsers = async (users) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// ── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app start
  useEffect(() => {
    const restore = async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (raw) setUser(JSON.parse(raw));
      } catch {}
      finally { setLoading(false); }
    };
    restore();
  }, []);

  // ── signup ────────────────────────────────────────────────────────────────
  // Called from SignupScreen. Creates user + auto-logs in.
  const signup = async (formData) => {
    const users = await getUsers();

    // Check duplicate mobile
    if (users.find((u) => u.mobile === formData.mobile)) {
      throw new Error('An account with this mobile number already exists.');
    }

    const newUser = {
      id: 'u_' + Date.now(),
      fullName:     formData.fullName     || '',
      businessName: formData.businessName || '',
      businessType: formData.businessType || '',
      mobile:       formData.mobile       || '',
      address:      formData.address      || '',
      city:         formData.city         || '',
      pincode:      formData.pincode      || '',
      gstNumber:    formData.gstNumber    || '',
      createdAt:    new Date().toISOString(),
    };

    await saveUsers([...users, newUser]);
    await _persistSession(newUser);
    return newUser;
  };

  // ── login ─────────────────────────────────────────────────────────────────
  // Called from LoginScreen. Finds user by mobile.
  const login = async (mobile) => {
    const users = await getUsers();
    const found = users.find((u) => u.mobile === mobile);
    if (!found) {
      throw new Error('No account found with this mobile number. Please register first.');
    }
    await _persistSession(found);
    return found;
  };

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  // ── refreshProfile ────────────────────────────────────────────────────────
  const refreshProfile = async () => {
    if (!user?.id) return;
    const users = await getUsers();
    const fresh = users.find((u) => u.id === user.id);
    if (fresh) {
      await _persistSession(fresh);
    }
  };

  // ── updateProfile ─────────────────────────────────────────────────────────
  const updateProfile = async (updates) => {
    if (!user?.id) return;
    const users = await getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return;
    const updated = { ...users[idx], ...updates };
    users[idx] = updated;
    await saveUsers(users);
    await _persistSession(updated);
  };

  // ── internal: persist session ─────────────────────────────────────────────
  const _persistSession = async (userData) => {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};