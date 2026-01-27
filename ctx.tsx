import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useRouter, useSegments } from "expo-router";
import React from "react";

const AuthContext = React.createContext<{
  session: Session | null;
  isLoading: boolean;
  signOut: () => void;
}>({
  session: null,
  isLoading: true,
  signOut: () => {},
});

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(session: Session | null) {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !session &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      // Note: In this specific app, we might want to allow public access to Home/Explore.
      // So we only redirect if they try to access Profile or specific protected routes.
      // For now, we will NOT force redirect globally, but handle it in the components or specific layouts.
      // router.replace('/login');
    } else if (session && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [session, segments]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useProtectedRoute(session);

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        signOut: () => supabase.auth.signOut(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
