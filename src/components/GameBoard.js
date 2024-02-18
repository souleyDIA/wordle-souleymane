import React from "react"; // Add the missing import statement for React

import Confetti from "react-confetti";
import WordLine from "./WordLine";
import "../assets/css/GameBoard.css";
import LoseGameModal from "./GameModals/LoseGameModal";
import WinGameModal from "./GameModals/WinGameModal";
import LoadingSpinner from "./LoadingSpinner";
import useGameState from "./hooks/useGameState";
import { initialStats } from "../utils/constants";

const GameBoard = () => {
  const {
    keyboard,
    gameBoard,
    currentWord,
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
    submitGuess,
    handleModal,
    resetGame,
  } = useGameState(initialStats);

  return (
    <div
      className="game-board min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-900"
      style={{ paddingTop: "0px", paddingBottom: "70px" }}
    >
      {isLoading && <LoadingSpinner />}
      {gameWon && showModal && (
        <WinGameModal
          key={`win-modal-${userStats.totalWins}`}
          resetGame={resetGame}
          closeModal={handleModal}
          userStats={userStats}
        />
      )}
      {gameWon && <Confetti className="animate-confetti" />}
      {lose && showModal && (
        <LoseGameModal
          key={`lose-modal-${userStats.totalWins}`}
          resetGame={resetGame}
          closeModal={handleModal}
          userStats={userStats}
        />
      )}
      <div className="p-8 space-y-2 bg-white shadow-md rounded-xl dark:bg-gray-800 dark:text-white">
        {gameBoard.map((row, rowIndex) => (
          <WordLine
            key={`wordline-${rowIndex}`}
            rowIndex={rowIndex}
            guess={row.letters}
            isSubmitted={row.isSubmitted}
            selectedBox={selectedBox}
          />
        ))}
        <div className="keyboard space-y-2">
          {[...Array(3)].map((_, groupIndex) => (
            <div key={groupIndex} className="grid grid-cols-10 gap-1 w-full">
              {keyboard
                .slice(groupIndex * 10, (groupIndex + 1) * 10)
                .map((letter, letterIndex) => (
                  <button
                    key={letter}
                    aria-label={`Select letter ${letter}`}
                    onClick={() => handleLetterClick(letter)}
                    className={`text-lg px-3 py-3 rounded ${
                      isSubmitted &&
                      guessedLetters.includes(letter) &&
                      !currentWord.includes(letter)
                        ? "bg-gray-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {letter}
                  </button>
                ))}
            </div>
          ))}
          <div className="grid grid-cols-10 gap-1 w-full">
            <button
              onClick={handleResetClick}
              className="col-start-1 col-span-5 text-lg px-4 py-2 bg-red-500 text-white rounded"
              aria-label="Reset selected box"
            >
              Reset Selected Box
            </button>
            <button
              onClick={submitGuess}
              className="col-start-6 col-span-5 text-lg px-4 py-2 bg-green-500 text-white rounded"
              aria-label="Submit guess"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
