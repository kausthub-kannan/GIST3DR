import { useState, useEffect } from "react";
import { getPatient } from "@/api/patient";

export function usePatientData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);

  // Get ID from URL
  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const urlId = pathSegments[pathSegments.length - 1];
    setId(urlId);
  }, []);

  // Fetch patient data
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await getPatient(id, token);
        setUser(response.data);
        setError(null);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return { user, loading, error };
}
