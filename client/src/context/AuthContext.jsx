import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase.js';
import { getProfile as fetchApiProfile } from '../services/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured) {
        // Fallback to persistent demo session for local exploration
        const storedDemo = localStorage.getItem('agroai_demo_user');
        if (storedDemo) {
          try {
            const parsed = JSON.parse(storedDemo);
            if (mounted) {
              setUser(parsed);
              setSession({ access_token: 'demo-token', user: parsed });
            }
          } catch {
            // ignore
          }
        }
        if (mounted) setLoading(false);
        return;
      }

      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user || null);
          if (initialSession?.user) {
            loadUserProfile();
          }
        }
      } catch (err) {
        console.warn('Error reading initial auth session:', err);
      } finally {
        if (mounted) setLoading(false);
      }

      // Listen to auth state transitions
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          if (currentSession?.user) {
            loadUserProfile();
          } else {
            setProfile(null);
          }
          setLoading(false);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  async function loadUserProfile() {
    try {
      const res = await fetchApiProfile();
      if (res?.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch user profile:', err);
    }
  }

  // Sign In with email & password
  async function signIn(email, password) {
    if (!isSupabaseConfigured) {
      // Offline/Dev mock sign-in
      const mockUser = {
        id: '00000000-0000-0000-0000-000000000001',
        email,
        user_metadata: { full_name: email.split('@')[0] || 'Farmer' },
      };
      localStorage.setItem('agroai_demo_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setSession({ access_token: 'demo-token', user: mockUser });
      return { user: mockUser, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  // Sign Up with email & password
  async function signUp(email, password, fullName, preferredLanguage = 'en') {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: '00000000-0000-0000-0000-000000000001',
        email,
        user_metadata: { full_name: fullName, preferred_language: preferredLanguage },
      };
      localStorage.setItem('agroai_demo_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setSession({ access_token: 'demo-token', user: mockUser });
      return { user: mockUser, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          preferred_language: preferredLanguage,
        },
      },
    });
    if (error) throw error;
    return data;
  }

  // Sign Out
  async function signOut() {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('agroai_demo_user');
      setUser(null);
      setSession(null);
      setProfile(null);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  }

  // Password Recovery
  async function resetPassword(email) {
    if (!isSupabaseConfigured) {
      return { success: true };
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings`,
    });
    if (error) throw error;
    return data;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshProfile: loadUserProfile,
        isConfigured: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

