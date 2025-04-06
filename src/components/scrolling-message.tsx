
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { getDailyVerseReference } from "@/utils/bibleVerseUtils";

// Fallback data in case API fails
const fallbackVerses = [
  { text: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.", reference: "Jeremiah 29:11" },
  { text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", reference: "Proverbs 3:5-6" },
  { text: "I can do all this through him who gives me strength.", reference: "Philippians 4:13" },
  { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.", reference: "Joshua 1:9" },
  { text: "The LORD is my shepherd, I lack nothing.", reference: "Psalm 23:1" }
];

const prayers = [
  "May the grace of our Lord Jesus Christ be with you today and always.",
  "Lord, grant us wisdom to make the right decisions today.",
  "Father, we thank you for your provision and blessings.",
  "Guide us with your light and truth throughout this day.",
  "May we walk in your love and share it with others today."
];

export function ScrollingMessage() {
  const [bibleVerse, setBibleVerse] = useState<{ text: string; reference: string } | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const [isVerse, setIsVerse] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Fetch Bible verse from API
  useEffect(() => {
    const fetchDailyBibleVerse = async () => {
      try {
        // Get today's Bible verse reference
        const verseReference = getDailyVerseReference();
        
        // Bible API request
        const verseResponse = await fetch(`https://bible-api.com/${verseReference}`);
        const verseData = await verseResponse.json();
        
        if (verseData && verseData.text) {
          setBibleVerse({
            text: verseData.text.trim(),
            reference: verseData.reference
          });
        } else {
          throw new Error("Invalid API response");
        }
        
        // Randomly select a prayer
        const randomPrayerIndex = Math.floor(Math.random() * prayers.length);
        setCurrentPrayer(prayers[randomPrayerIndex]);
        setCurrentIndex(randomPrayerIndex);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Bible verse:", error);
        // Use fallback data
        const fallbackIndex = Math.floor(Math.random() * fallbackVerses.length);
        setBibleVerse(fallbackVerses[fallbackIndex]);
        setCurrentPrayer(prayers[0]);
        setCurrentIndex(0);
        setIsLoading(false);
      }
    };

    fetchDailyBibleVerse();
  }, []);
  
  // Cycle between verse and prayer
  useEffect(() => {
    if (isLoading) return;
    
    const interval = setInterval(() => {
      if (isVerse) {
        // If we're currently showing a verse, switch to a prayer
        setIsVerse(false);
      } else {
        // If we're showing a prayer, switch to a verse and cycle to next prayer
        setIsVerse(true);
        setCurrentIndex(prev => (prev + 1) % prayers.length);
        setCurrentPrayer(prayers[currentIndex]);
      }
    }, 10000); // Switch every 10 seconds
    
    return () => clearInterval(interval);
  }, [isLoading, isVerse, currentIndex]);
  
  const currentContent = isLoading 
    ? "Loading daily inspiration..." 
    : isVerse 
      ? bibleVerse ? `${bibleVerse.text} — ${bibleVerse.reference}` : "Loading verse..."
      : currentPrayer || "Loading prayer...";

  return (
    <div className="w-full bg-gradient-to-r from-gold-600/30 to-gold-500/20 dark:from-gold-700/30 dark:to-gold-800/20 overflow-hidden py-1.5 relative">
      <div className="marquee-container flex items-center">
        <div className="flex items-center animate-marquee whitespace-nowrap">
          <div className="flex items-center text-sm text-gold-800 dark:text-gold-100">
            <span className="font-semibold mx-2">
              {isLoading ? "Loading..." : isVerse ? "Daily Verse" : "Prayer"}:
            </span>
            <ChevronRight className="h-4 w-4 text-gold-600 dark:text-gold-400" />
            <span className="mx-2">{currentContent}</span>
            <ChevronRight className="h-4 w-4 text-gold-600 dark:text-gold-400" />
          </div>
          {/* Duplicate content for continuous loop effect */}
          <div className="flex items-center text-sm text-gold-800 dark:text-gold-100 ml-8">
            <span className="font-semibold mx-2">
              {isLoading ? "Loading..." : isVerse ? "Daily Verse" : "Prayer"}:
            </span>
            <ChevronRight className="h-4 w-4 text-gold-600 dark:text-gold-400" />
            <span className="mx-2">{currentContent}</span>
            <ChevronRight className="h-4 w-4 text-gold-600 dark:text-gold-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
