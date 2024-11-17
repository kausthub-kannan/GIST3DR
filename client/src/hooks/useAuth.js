import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token && router.pathname !== '/sign-up') {
            router.push('/sign-in');
        }
    }, [router]);
}


export function useAuthOnAuthPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && router.pathname !== '/sign-up') {
            router.push('/');
        }
    }, [router]);
}

