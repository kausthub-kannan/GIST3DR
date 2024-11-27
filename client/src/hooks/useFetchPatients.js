import { getAllPatients } from "@/api/patient";
import usePatientsStore from "@/stores/patientStore";
import { useLogout } from "@/hooks/useAuth";

export function useFetchPatients() {
  const logout = useLogout();

  const fetchPatients = async () => {
    const token = localStorage.getItem("token");
    const { updatePatientsArray, setLoading } = usePatientsStore.getState();

    if (!token) {
      console.error("Token is required to fetch patients");
      logout();
      return;
    }

    try {
      setLoading(true);
      const response = await getAllPatients(token);
      console.log("fetchPatients Response:", response);
      updatePatientsArray(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  return { fetchPatients };
}
