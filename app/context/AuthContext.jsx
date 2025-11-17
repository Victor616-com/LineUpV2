import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";
const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [themeId, setThemeId] = useState(null);
  const themeColors = {
    1: "#1E1E1E",
    2: "#3F4D54",
    3: "#575252",
    4: "#3F4254",
    5: "#4D3F54",
    6: "#543F40",
  };
  const defaultColor = "#3F4D54";

  // Get current theme
  const fetchTheme = async (userId) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("theme")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching theme:", error);
    } else {
      setThemeId(data?.theme || null);
    }
  };

  // Sign up
  const signUpNewUser = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { success: false, error };

    // Insert name into profile table
    const user = data.user;
    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ id: user.id, name });

      if (profileError) return { success: false, error: profileError };
    }

    return { success: true, data };
  };

  // Sign in
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.log("Error signing in:", error);
        return { success: false, error };
      }
      console.log("Sign-in successful:", data); // Remove before deployment
      return { success: true, data }; // Remove before deployment
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Sign Out
  const signOut = () => {
    const { error } = supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  };
  // Listen for session changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) fetchTheme(session.user.id);
    });

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user?.id) fetchTheme(session.user.id);
        else setThemeId(null);
      },
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  const themeColor = themeId ? themeColors[themeId] : defaultColor;
  return (
    <AuthContext.Provider
      value={{
        session,
        setSession,
        signUpNewUser,
        signInUser,
        signOut,
        themeId,
        themeColor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
