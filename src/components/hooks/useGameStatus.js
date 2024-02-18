import { useState, useCallback } from "react";

export const useGameStatus = (initialStats, currentLine, currentWord) => {
  const [userStats, setUserStats] = useState(initialStats);

  const handleWin = useCallback(() => {
    setUserStats((prevStats) => ({
      ...prevStats,
      linePerformance: prevStats.linePerformance.map((value, index) =>
        index === currentLine ? value + 1 : value
      ),
      lastWord: currentWord,
    }));
  }, [currentLine, currentWord, setUserStats]);

  const handleLose = useCallback(() => {
    setUserStats((prevStats) => ({
      ...prevStats,
      totalGames: prevStats.totalGames + 1,
      currentStreak: 0,
      linePerformance: prevStats.linePerformance.map((value, index) =>
        index === 5 ? value + 1 : value
      ),
      lastWord: currentWord,
    }));
  }, [currentWord, setUserStats]);

  const resetUserStats = useCallback(() => {
    setUserStats(initialStats);
  }, [initialStats]);

  return { userStats, handleWin, handleLose, resetUserStats };
};
