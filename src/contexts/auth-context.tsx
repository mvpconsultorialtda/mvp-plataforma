"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, useMock } from "@/lib/firebase";
import type { User, UserBasic } from "@/lib/types";

// ─── Context Type ────────────────────────────────────────

interface AuthContextType {
  user: UserBasic | null;
  fullUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  fullUser: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logout: async () => {},
});

// ─── Mock User ───────────────────────────────────────────

const MOCK_USER: UserBasic = {
  id: "mock-1",
  name: "Carlos Santos",
  email: "carlos@mvp.com.br",
};

// ─── Helper ──────────────────────────────────────────────

async function getOrCreateUserDoc(firebaseUser: FirebaseUser): Promise<User> {
  const userRef = doc(db, "users", firebaseUser.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    return { uid: snap.id, ...snap.data() } as User;
  }

  const newUser: Omit<User, "uid"> = {
    name: firebaseUser.displayName || "Usuário",
    email: firebaseUser.email || "",
    avatar: firebaseUser.photoURL || undefined,
    role: "user",
    bio: "",
    location: "",
    pixKey: "",
    projects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(userRef, { ...newUser, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return { uid: firebaseUser.uid, ...newUser };
}

// ─── Provider ────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserBasic | null>(null);
  const [fullUser, setFullUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (useMock) {
      const saved = localStorage.getItem("mvp-auth");
      if (saved === "true") {
        setUser(MOCK_USER);
      }
      setIsLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await getOrCreateUserDoc(firebaseUser);
          setFullUser(userData);
          setUser({
            id: userData.uid,
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
          });
        } catch {
          setUser(null);
          setFullUser(null);
        }
      } else {
        setUser(null);
        setFullUser(null);
      }
      setIsLoading(false);
    });

    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    if (useMock) {
      setUser(MOCK_USER);
      localStorage.setItem("mvp-auth", "true");
      return;
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    if (useMock) {
      setUser(MOCK_USER);
      localStorage.setItem("mvp-auth", "true");
      return;
    }
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const register = async (name: string, email: string, password: string) => {
    if (useMock) {
      setUser({ ...MOCK_USER, name, email });
      localStorage.setItem("mvp-auth", "true");
      return;
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "users", cred.user.uid);
    await setDoc(userRef, {
      name,
      email,
      role: "user",
      projects: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const logout = async () => {
    if (useMock) {
      setUser(null);
      localStorage.removeItem("mvp-auth");
      return;
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        fullUser,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
