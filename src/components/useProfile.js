import { useEffect, useState } from "react";

export function useProfile() {
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/profile");

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const profileData = await response.json();
        setData(profileData);
      } catch (err) {
        setError(err.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { loading, data, error };
}
