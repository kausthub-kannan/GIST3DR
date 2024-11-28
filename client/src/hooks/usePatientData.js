import { useState, useEffect, useMemo } from "react";
import { getPatient } from "@/api/patient";
import { isTokenExpired } from "./useAuth";

export function usePatientData() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Parse ID from URL directly
    const id = useMemo(() => {
        const pathSegments = window.location.pathname.split("/");
        return pathSegments[pathSegments.length - 1];
    }, []);

    // Fetch patient data
    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;

            try {
                const token = localStorage.getItem("token");

                // Check if the token exists and is valid
                if (!token || isTokenExpired()) {
                    throw new Error("Authentication token is missing or expired.");
                }

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
