import { useEffect } from "react";
import { useRouter, Slot, usePathname } from "expo-router";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/signIn") {
      router.replace("/signIn"); // Redirect to Sign-In on app start
    }
  }, []);

  return <Slot />;
}
