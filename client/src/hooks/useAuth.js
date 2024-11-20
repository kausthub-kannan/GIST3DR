import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useAuthStore from "@/stores/authStore";

export function useAuth() {
    const router = useRouter();
    // const token = useAuthStore((state) => state.token);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; // Ensure this works in the browser
    if (!token && router.pathname !== '/sign-up') {
        router.push('/sign-in');
    }
}


export function useAuthOnAuthPage() {
    const router = useRouter();
    // const token = useAuthStore((state) => state.token);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; // Ensure this works in the browser
    if (token && router.pathname !== '/sign-up') {
        router.push('/');
    }
}

