import { getAllPatients } from "@/api/patient";
import usePatientsStore from "@/stores/patientStore";
import useAuthStore from "@/stores/authStore";
import { isTokenExpired, handleLogout } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

const fetchPatientsData = async ({ queryKey }) => {
    const [, token] = queryKey;
    if (!token) throw new Error("Token is missing");
    try {
        const response = await getAllPatients(token);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching patients:", error);
        return []; // Return an empty array if there's an error
    }
};


export const usePatients = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const { updatePatientsArray, setLoading } = usePatientsStore();
    const router = useRouter();
    const clearAuthData = useAuthStore.getState().clearAuthData;

    // Handle logout on token expiration
    if (!token || isTokenExpired()) {
        localStorage.clear(); // Clear all local storage
        deleteCookie("token");
        clearAuthData?.(); // Clear Zustand store
        router.push("/sign-in");
        return { patients: null, isLoading: false, isError: true, refreshData: () => { } };
    }

    // Use TanStack Query's useQuery hook
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["patients", token], // Token in queryKey for cache invalidation
        queryFn: fetchPatientsData, // Fetching function
        enabled: !!token, // Only fetch if token exists
        onSuccess: (data) => updatePatientsArray(data), // Update Zustand on success
        onError: (error) => {
            console.error("Failed to fetch patients:", error);
            handleLogout(); // Handle invalid token
        },
        onSettled: () => setLoading(false), // Set loading state to false
    });

    // Return refresh and fetched data
    return {
        patients: data,
        isLoading,
        isError,
        refreshData: refetch,
    };
};
