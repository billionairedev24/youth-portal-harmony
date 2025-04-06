
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

// Bible verses and prayers to display
const bibleVerses = [
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVerse, setIsVerse] = useState(true);
  
  // Automatically cycle through verses and prayers
  useEffect(() => {
    const interval = setInterval(() => {
      if (isVerse) {
        // If we've shown all verses, switch to prayers
        if (currentIndex >= bibleVerses.length - 1) {
          setCurrentIndex(0);
          setIsVerse(false);
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      } else {
        // If we've shown all prayers, switch to verses
        if (currentIndex >= prayers.length - 1) {
          setCurrentIndex(0);
          setIsVerse(true);
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      }
    }, 10000); // Change every 10 seconds
    
    return () => clearInterval(interval);
  }, [currentIndex, isVerse]);
  
  const currentContent = isVerse 
    ? `${bibleVerses[currentIndex].text} — ${bibleVerses[currentIndex].reference}`
    : prayers[currentIndex];

  return (
    <div className="w-full bg-gradient-to-r from-gold-600/30 to-gold-500/20 dark:from-gold-700/30 dark:to-gold-800/20 overflow-hidden py-1.5 relative">
      <div className="marquee-container flex items-center">
        <div className="flex items-center animate-marquee whitespace-nowrap">
          <div className="flex items-center text-sm text-gold-800 dark:text-gold-100">
            <span className="font-semibold mx-2">
              {isVerse ? "Daily Verse" : "Prayer"}:
            </span>
            <ChevronRight className="h-4 w-4 text-gold-600 dark:text-gold-400" />
            <span className="mx-2">{currentContent}</span>
            <ChevronRight className="h-4 w-4 text-gold-600 dark:text-gold-400" />
          </div>
          {/* Duplicate content for continuous loop effect */}
          <div className="flex items-center text-sm text-gold-800 dark:text-gold-100 ml-8">
            <span className="font-semibold mx-2">
              {isVerse ? "Daily Verse" : "Prayer"}:
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
