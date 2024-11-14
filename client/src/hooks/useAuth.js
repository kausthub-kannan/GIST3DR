import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/sign-in');
        }
    }, [router]);
}

export function useAuthOnAuthPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            router.push('/');
        }
    }, [router]);
}
