import { useState, useEffect, useCallback } from "react";
import { ALPHABET } from "../../utils/constants";
import { isValidGuessWord, checkWordValidity } from "../../utils/gameHelpers";
import { useWordManagement } from "./useWordManagement";
import { useGameBoardManagement } from "./useGameBoardManagement";
import { useGameStatus } from "./useGameStatus";

export const useGameState = (initialStats) => {
  const keyboard = ALPHABET;

  const [currentLine, setCurrentLine] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [lose, setLose] = useState(false);

  const { currentWord, isLoading } = useWordManagement();

  const {
    gameBoard,
    setGameBoard,
    attemptsLeft,
    decrementAttempts,
    selectedBox,
    setSelectedBox,
    resetGameBoard,
  } = useGameBoardManagement();

  const { userStats, handleWin, handleLose, resetUserStats } = useGameStatus(
    initialStats,
    currentLine,
    currentWord
  );

  const handleLetterClick = useCallback(
    (letter) => {
      if (attemptsLeft === 0 || isSubmitted) return;
      const newGameBoard = [...gameBoard];
      const currentRow = newGameBoard[currentLine];
      const currentLetter = currentRow.letters[selectedBox.letterIndex];

      if (currentLetter.isSelected) return;
      currentLetter.letter = letter;
      currentLetter.isSelected = true;

      setGameBoard(newGameBoard);
      setSelectedBox((prevBox) => ({
        ...prevBox,
        letterIndex: prevBox.letterIndex + 1 < 5 ? prevBox.letterIndex + 1 : 0,
      }));
    },
    [
      attemptsLeft,
      isSubmitted,
      gameBoard,
      currentLine,
      selectedBox,
      setGameBoard,
      setSelectedBox,
    ]
  );

  const handleResetClick = useCallback(() => {
    if (!selectedBox || attemptsLeft === 0 || isSubmitted) return;
    const newGameBoard = [...gameBoard];
    const newLine = newGameBoard[currentLine];
    // Ensure that selectedBox.letterIndex does not go below 0
    const newLetterIndex = Math.max(0, selectedBox.letterIndex - 1);
    const newLetter = newLine.letters[newLetterIndex];
    newLetter.letter = "";
    newLetter.isSelected = false;
    setGameBoard(newGameBoard);
    setSelectedBox({
      line: currentLine,
      letterIndex: newLetterIndex,
    });
  }, [
    attemptsLeft,
    isSubmitted,
    gameBoard,
    currentLine,
    selectedBox,
    setGameBoard,
    setSelectedBox,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetCurrentLineLetters = () => {
    setGameBoard((prevBoard) => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard));
      newBoard[currentLine].letters.forEach(
        (letterObj) => (letterObj.letter = "")
      );
      newBoard[currentLine].isSubmitted = false; // Reset the isSubmitted state
      setIsSubmitted(false);
      return newBoard;
    });
  };

  const handleReset = useCallback(() => {
    const newGameBoard = Array.from({ length: 6 }, () => ({
      letters: Array.from({ length: 5 }, () => ({
        letter: "",
        isSelected: false,
      })),
      isSubmitted: false,
    }));
    setGameBoard(newGameBoard);
    setCurrentLine(0);
    setSelectedBox({ line: 0, letterIndex: 0 });
  }, [setGameBoard, setSelectedBox]);

  const getCurrentGuessWord = useCallback(() => {
    return gameBoard[currentLine].letters
      .map((letterObj) => letterObj.letter)
      .join("");
  }, [gameBoard, currentLine]);

  const canSubmitGuess = useCallback(() => {
    return !(isLoading || isSubmitted);
  }, [isLoading, isSubmitted]);

  const updateGameStateAfterValidGuess = useCallback(() => {
    setGameBoard((prevBoard) => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard));
      let correctGuessCount = 0;

      // Update the status of each letter in the current guess
      newBoard[currentLine].letters.forEach((letterObj, index) => {
        const letter = letterObj.letter;
        if (letter === currentWord[index]) {
          letterObj.status = "correct";
          correctGuessCount++;
        } else if (currentWord.includes(letter)) {
          letterObj.status = "wrong-position";
        } else {
          letterObj.status = "incorrect";
        }
      });

      // Check for win condition
      if (correctGuessCount === 5) {
        setGameWon(true);
        setShowModal(true);
        handleWin();
      }

      // Mark the current line as submitted and advance to the next line
      newBoard[currentLine].isSubmitted = true;
      setIsSubmitted(true);

      // Advance to the next line and decrement attempts left
      setCurrentLine((currentLine) => currentLine + 1);
      decrementAttempts();

      return newBoard;
    });
  }, [
    currentLine,
    currentWord,
    setGameBoard,
    decrementAttempts,
    handleWin,
    setIsSubmitted,
    setCurrentLine,
  ]);

  const submitGuess = useCallback(async () => {
    if (!canSubmitGuess()) return;

    const currentGuessWord = getCurrentGuessWord();
    if (!isValidGuessWord(currentGuessWord)) return;

    try {
      const isWordValid = await checkWordValidity(currentGuessWord);
      if (!isWordValid) {
        alert("This word does not exist!");
        resetCurrentLineLetters();
      } else {
        await updateGameStateAfterValidGuess();

        if (!gameWon) {
          setIsSubmitted(false);
          setCurrentLine(currentLine + 1);
          setSelectedBox({ line: currentLine + 1, letterIndex: 0 });
        }
        return true;
      }
    } catch (error) {
      console.error("Error while checking the word: ", error);
      alert("There was an error checking your word. Please try again.");
    }
  }, [
    currentLine,
    gameWon,
    setSelectedBox,
    canSubmitGuess,
    getCurrentGuessWord,
    resetCurrentLineLetters,
    updateGameStateAfterValidGuess,
  ]);

  const handleEnter = useCallback(async () => {
    if (attemptsLeft === 0 || isSubmitted) return;
    const newGameBoard = [...gameBoard];
    const newLine = newGameBoard[currentLine];
    newLine.isSubmitted = true;
    setGameBoard(newGameBoard);
    setCurrentLine(currentLine + 1);
    setSelectedBox({ line: currentLine + 1, letterIndex: 0 });
    await submitGuess();
  }, [
    attemptsLeft,
    setGameBoard,
    isSubmitted,
    gameBoard,
    setSelectedBox,
    currentLine,
    submitGuess,
  ]);

  useEffect(() => {
    if (attemptsLeft === 0 && !gameWon && !lose) {
      setLose(true);
      setShowModal(true);
      handleLose();
    }
  }, [attemptsLeft, gameWon, handleLose, lose]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
        handleLetterClick(event.key.toLowerCase());
      } else if (event.key === "Enter") {
        handleEnter();
      } else if (event.key === "Backspace") {
        handleResetClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleLetterClick, handleEnter, handleResetClick]);

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const resetGame = useCallback(async () => {
    // Fetch a new word internally within useWordManagement
    await resetGameBoard(); // This should internally reset the game board and attempts
    setCurrentLine(0);
    setGuessedLetters([]);
    setIsSubmitted(false);
    setGameWon(false);
    setLose(false);
    resetUserStats();
  }, [resetGameBoard, resetUserStats]);

  return {
    keyboard,
    gameBoard,
    currentWord,
    attemptsLeft,
    currentLine,
    selectedBox,
    guessedLetters,
    isSubmitted,
    gameWon,
    lose,
    isLoading,
    userStats,
    showModal,
    handleLetterClick,
    handleResetClick,
    handleEnter,
    handleReset,
    submitGuess,
    handleModal,
    resetGame,
  };
};

export default useGameState;
