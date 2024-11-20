import { getPatients } from "@/api/patient";
import usePatientsStore from "@/stores/patientStore";
import useAuthStore from "@/stores/authStore";

export const fetchPatients = async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
        console.error("Token is required to fetch patients");
        return;
    }

    const { updatePatientsArray, setLoading } = usePatientsStore.getState();

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
