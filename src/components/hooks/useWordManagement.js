import { useState, useEffect } from "react";
import fetchRandomWord from "../../utils/api/wordApi";

export const useWordManagement = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeGame = async () => {
      setIsLoading(true);
      try {
        const randomWord = await fetchRandomWord();
        setCurrentWord(randomWord);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize game:", error);
        setIsLoading(false);
      }
    };

    initializeGame();
  }, []);

  return { currentWord, isLoading, setCurrentWord, setIsLoading };
};
