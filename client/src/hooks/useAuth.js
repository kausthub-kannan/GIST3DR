import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/stores/authStore";
import { deleteCookie } from "cookies-next";
// import { jwtDecode } from 'jwt-decode';
import { jwtDecode } from "jwt-decode";

// Ensure this works in the browser

export const isTokenExpired = () => {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return true;

    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime; //token expired
  } catch (err) {
    console.error(err);
    return true; //treat as expired if decoding failed
  }
};

export function useAuth() {
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token && router.pathname !== "/sign-up") {
      router.push("/sign-in");
    }
  }, [token, router]); // Add router to dependencies
}

export function useAuthOnAuthPage() {
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token && router.pathname !== "/sign-up") {
      router.push("/");
    }
  }, [token, router]); // Add router to dependencies
}

export function useLogout() {
  const clearAuthData = useAuthStore((state) => state.clearAuthData);
  const router = useRouter();

  return () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_first_name");
      localStorage.removeItem("user_last_name");
      deleteCookie("token");
    }

    // Clear Zustand store
    if (clearAuthData) clearAuthData();

    router.push("/sign-in");
    console.log("User logged out successfully.");
  };
}
