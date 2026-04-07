import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

// Cache admin role check to avoid redundant RPC calls
let cachedAdminResult: { userId: string; isAdmin: boolean } | null = null;

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const initialCheckDone = useRef(false);

  useEffect(() => {
    let mounted = true;

    const checkRole = async (currentUser: User | null) => {
      if (!currentUser) {
        if (mounted) { setUser(null); setIsAdmin(false); setLoading(false); }
        return;
      }

      if (mounted) setUser(currentUser);

      // Use cached result if same user
      if (cachedAdminResult && cachedAdminResult.userId === currentUser.id) {
        if (mounted) { setIsAdmin(cachedAdminResult.isAdmin); setLoading(false); }
        return;
      }

      const { data } = await supabase.rpc("has_role", {
        _user_id: currentUser.id,
        _role: "admin",
      });
      const result = !!data;
      cachedAdminResult = { userId: currentUser.id, isAdmin: result };
      if (mounted) { setIsAdmin(result); setLoading(false); }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!initialCheckDone.current) {
        initialCheckDone.current = true;
        checkRole(session?.user ?? null);
      }
    });

    // Listen for auth changes (sign in/out only, skip INITIAL_SESSION)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;
      cachedAdminResult = null; // Invalidate cache on auth change
      checkRole(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    cachedAdminResult = null;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    cachedAdminResult = null;
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return { user, isAdmin, loading, signIn, signOut };
}
