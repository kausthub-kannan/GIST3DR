import { getPatients } from "@/api/patient";
import usePatientsStore from "@/stores/patientStore";
import useAuthStore from "@/stores/authStore";
import { isTokenExpired, handleLogout } from '@/hooks/useAuth';

export const fetchPatients = async () => {
    // const token = useAuthStore.getState().token;
    const token = localStorage.getItem("token");
    const { updatePatientsArray, setLoading } = usePatientsStore.getState();

    if (!token) {
        console.error("Token is required to fetch patients");
        handleLogout();
        return;
    }


    try {
        setLoading(true); // Set loading to true before fetching
        const response = await getPatients(token);
        console.log("fetchPatients Response:", response);
        updatePatientsArray(response.data); // Update Zustand store with fetched data
    } catch (error) {
        console.error("Error fetching patients:", error);
    } finally {
        setLoading(false); // Set loading to false after fetching
    }
};
