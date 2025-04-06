
// List of commonly requested Bible verses for variety
const popularVerseReferences = [
  "john+3:16",
  "psalm+23",
  "proverbs+3:5-6",
  "philippians+4:13",
  "jeremiah+29:11",
  "romans+8:28",
  "matthew+28:19-20",
  "genesis+1:1",
  "psalm+91",
  "romans+12:2",
  "joshua+1:9",
  "isaiah+40:31",
  "philippians+4:6-7",
  "hebrews+11:1",
  "romans+5:8",
  "2+corinthians+5:17",
  "galatians+5:22-23",
  "psalm+119:105",
  "ephesians+2:8-9",
  "1+corinthians+13:4-8"
];

// Get a verse reference that stays consistent for the day
export const getDailyVerseReference = (): string => {
  const today = new Date();
  const dayOfYear = getDayOfYear(today);
  const yearIdentifier = today.getFullYear();
  
  // Create a seeded random number generator based on the day of the year and year
  const randomIndex = Math.floor(
    (((dayOfYear * 13) + yearIdentifier) % popularVerseReferences.length)
  );
  
  return popularVerseReferences[randomIndex];
};

// Helper function to get the day of the year (1-366)
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
