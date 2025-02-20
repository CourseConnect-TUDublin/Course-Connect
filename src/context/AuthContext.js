"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  // ✅ Keep `user` state in sync with NextAuth session
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session, status]);

  return (
    <AuthContext.Provider value={{ user, status, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
