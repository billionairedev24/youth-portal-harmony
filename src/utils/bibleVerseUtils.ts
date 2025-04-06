
// A utility to help get Bible verses consistently
export const getDailyVerseReference = async (): Promise<string> => {
  try {
    // Use the random endpoint provided by bible-api.com
    const response = await fetch('https://bible-api.com/random');
    
    if (!response.ok) {
      throw new Error('Failed to fetch random verse');
    }
    
    const data = await response.json();
    return data.reference;
  } catch (error) {
    console.error("Error fetching random verse:", error);
    // Fallback to a default verse if the API fails
    return "john+3:16";
  }
};
