import { useEffect } from 'react';
import useAuthStore from '@/stores/authStore';

export const useInitializeAuth = () => {
  const setAuthData = useAuthStore((state) => state.setAuthData);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user_email = localStorage.getItem("user_email");
    const user_first_name = localStorage.getItem("user_first_name");
    const user_last_name = localStorage.getItem("user_last_name");

    if (token) {
      setAuthData({
        isAuthenticated: true,
        token,
        user_email,
        user_first_name,
        user_last_name,
      });
    }
  }, [setAuthData]);
};
