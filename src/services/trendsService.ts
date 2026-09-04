export const fetchGoogleTrends = async (query: string) => {
  try {
    const response = await fetch(`/api/trends?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch trends");
    }
    return await response.json();
  } catch (error) {
    console.error("Trends Service Error:", error);
    throw error;
  }
};
