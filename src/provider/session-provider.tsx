import GlobalLoader from "@/components/global-loader";
import { useProfileData } from "@/hooks/queries/use-profile-data";
import supabase from "@/lib/supabase";
import { useIsSessionLoaded, useSession, useSetSession } from "@/store/session";
import { useEffect, type ReactNode } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const setSession = useSetSession();
  const isSessionLoaded = useIsSessionLoaded();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!isSessionLoaded) return <GlobalLoader />;

  return children;
}
