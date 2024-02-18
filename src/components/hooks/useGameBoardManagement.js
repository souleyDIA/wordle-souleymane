import { useState, useCallback } from "react";
import { initializeGameBoard } from "../../utils/gameHelpers";
import { useAttempts } from "./useAttempts";

export const useGameBoardManagement = () => {
  const [gameBoard, setGameBoard] = useState(initializeGameBoard());
  const { attemptsLeft, decrementAttempts, resetAttempts } = useAttempts();
  const [selectedBox, setSelectedBox] = useState({ line: 0, letterIndex: 0 });

  const resetGameBoard = useCallback(() => {
    setGameBoard(initializeGameBoard());
    resetAttempts();
    setSelectedBox({ line: 0, letterIndex: 0 });
  }, [resetAttempts]);

  return {
    gameBoard,
    setGameBoard,
    attemptsLeft,
    decrementAttempts,
    selectedBox,
    setSelectedBox,
    resetGameBoard,
  };
};
