// app/_layout.tsx
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { Slot, useRouter } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthSwitch />
    </AuthProvider>
  );
}

const AuthSwitch = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace("/signIn");
    } else {
      router.replace("/");
    }
  }, [user]);

  return <Slot />;
};
