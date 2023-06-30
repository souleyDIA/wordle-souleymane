import Confetti from 'react-confetti';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import WordLine from './WordLine';
import '../assets/css/GameBoard.css';
import LoseGameModal from './LoseGameModal';
import WinGameModal from './WinGameModal';
import LoadingSpinner from './LoadingSpinner';

const initialStats = {
  totalGames: 0,
  totalWins: 0,
  currentStreak: 0,
  bestStreak: 0,
  linePerformance: Array(6).fill(0), // Initialize an array of size 7 (one for each line and for "dead")
  lastWord: '',
};

const GameBoard = () => {
  const ALPHABET = [
    'q',
    'w',
    'e',
    'r',
    't',
    'y',
    'u',
    'i',
    'o',
    'p',
    'a',
    's',
    'd',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'z',
    'x',
    'c',
    'v',
    'b',
    'n',
    'm',
  ];

  const [keyboard, setKeyboard] = useState(ALPHABET);
  const [gameBoard, setGameBoard] = useState(
    Array(6).fill({
      letters: Array(5).fill({ letter: '', isSelected: false }),
      isSubmitted: false,
    }),
  );
  const [currentWord, setCurrentWord] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(6);
  const [currentLine, setCurrentLine] = useState(0);
  const [selectedBox, setSelectedBox] = useState({ line: 0, letterIndex: 0 });
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [lose, setLose] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState(initialStats);
  const [showModal, setShowModal] = useState(false);

  // Update the user's stats when the game is won
  const handleWin = () => {
    setUserStats(prevStats => ({
      ...prevStats,
      linePerformance: prevStats.linePerformance.map((value, index) =>
        index === currentLine ? value + 1 : value,
      ),
      lastWord: currentWord,
    }));
  };

  // Update the user's stats when the game is lost
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLose = useCallback(() => {
    setUserStats(prevStats => ({
      ...prevStats,
      totalGames: prevStats.totalGames + 1,
      currentStreak: 0,
      linePerformance: prevStats.linePerformance.map((value, index) =>
        index === 5 ? value + 1 : value,
      ),
      lastWord: currentWord,
    }));
  }, [currentWord]);

  useEffect(() => {
    fetch('https://api.datamuse.com/words?sp=?????')
      .then(response => response.json())
      .then(data => {
        const words = data.map(wordObj => wordObj.word); // map the response to get the word strings
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setCurrentWord(randomWord);
        console.log('Current word to guess:', randomWord); // This will log the word to guess in the console
        setIsLoading(false);
        // console.log('Current word to guess:', randomWord); // This will log the word to guess in the console
      });
  }, []);

  // Maintenant je veux quand le jour trouve le mot à deviner,  la partie se termine et il y a un modal qui s'affiche pour dire lui donner son score, qui va être

  const handleLetterClick = useCallback(
    letter => {
      setGuessedLetters([...guessedLetters, letter]);

      setGameBoard(prevBoard => {
        const newBoard = JSON.parse(JSON.stringify(prevBoard)); // Deep copy of the previous board

        // Set the letter and isSelected for the current LetterBox
        for (let j = 0; j < newBoard[currentLine].letters.length; j++) {
          if (newBoard[currentLine].letters[j].letter === '') {
            newBoard[currentLine].letters[j].letter = letter;
            newBoard[currentLine].letters[j].isSelected = true;
            setSelectedBox({ line: currentLine, letterIndex: j });
            return newBoard;
          }
        }

        return newBoard;
      });
    },
    [currentLine, guessedLetters],
  );

  const handleResetClick = useCallback(() => {
    if (!selectedBox) {
      alert('No box selected');
      return;
    }

    setGameBoard(prevBoard => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard));
      newBoard[selectedBox.line].letters[selectedBox.letterIndex].letter = '';
      newBoard[selectedBox.line].letters[
        selectedBox.letterIndex
      ].isSelected = false;

      // Move to the previous box
      if (selectedBox.letterIndex > 0) {
        newBoard[selectedBox.line].letters[
          selectedBox.letterIndex - 1
        ].isSelected = true;
        setSelectedBox({
          line: selectedBox.line,
          letterIndex: selectedBox.letterIndex - 1,
        });
      } else if (selectedBox.line > 0) {
        newBoard[selectedBox.line - 1].letters[
          newBoard[selectedBox.line - 1].letters.length - 1
        ].isSelected = true;
        setSelectedBox({
          line: selectedBox.line - 1,
          letterIndex: newBoard[selectedBox.line - 1].letters.length - 1,
        });
      } else {
        setSelectedBox(null); // No more boxes to move to
      }

      return newBoard;
    });
  }, [selectedBox]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetCurrentLineLetters = () => {
    setGameBoard(prevBoard => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard));
      newBoard[currentLine].letters.forEach(
        letterObj => (letterObj.letter = ''),
      );
      newBoard[currentLine].isSubmitted = false; // Reset the isSubmitted state
      setIsSubmitted(false);
      return newBoard;
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateGameBoardAfterSuccessfulGuess = () => {
    setGameBoard(prevBoard => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard));
      let correctGuessCount = 0;

      newBoard[currentLine].letters.forEach((letterObj, index) => {
        const letter = letterObj.letter;
        if (letter === currentWord[index]) {
          letterObj.status = 'correct';
          correctGuessCount++;
        } else if (currentWord.includes(letter)) {
          letterObj.status = 'wrong-position';
        } else {
          letterObj.status = 'incorrect';
        }
      });

      if (correctGuessCount === 5) {
        // The user has guessed the word correctly
        // alert(`Congratulations! You've guessed the word: ${currentWord}`);
        // Here we set a state variable indicating that the game is won
        setGameWon(true);
        setShowModal(true);
        handleWin();
      }

      newBoard[currentLine].isSubmitted = true;
      setIsSubmitted(true);

      return newBoard;
    });
  };

  const resetGame = () => {
    setGameBoard(
      Array(6).fill({
        letters: Array(5).fill({ letter: '', isSelected: false }),
        isSubmitted: false,
      }),
    );
    setCurrentWord('');
    setAttemptsLeft(6);
    setCurrentLine(0);
    setSelectedBox({ line: 0, letterIndex: 0 });
    setGuessedLetters([]);
    setUserStats(initialStats);
    setIsSubmitted(false);
    setGameWon(false);
    setLose(false);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false); // This function just closes the modal
  };

  const submitGuess = useCallback(async () => {
    if (isLoading) {
      return;
    }

    if (attemptsLeft === 0 || currentLine >= 6) {
      alert('Game Over!');
      return;
    }

    const currentGuessWord = gameBoard[currentLine].letters
      .map(letterObj => letterObj.letter)
      .join('');

    if (currentGuessWord.length < 5) {
      alert('Please enter a word with 5 letters.');
      return;
    }
    try {
      const response = await axios.get(
        `https://api.wordnik.com/v4/word.json/${currentGuessWord}/definitions?${process.env.REACT_APP_WORDNIK_API_KEY}}`,
      );

      if (response.data.length === 0 || response.data.message === 'Not found') {
        alert('This word does not exist!');
        resetCurrentLineLetters();
      } else {
        if (!currentWord) {
          // check if currentWord is not undefined or null
          setIsLoading(true); // set loading to true when starting the fetch
          return;
        }
        updateGameBoardAfterSuccessfulGuess();
        setCurrentLine(currentLine + 1);
        setAttemptsLeft(attemptsLeft - 1);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('Word not found: ', error);
        alert('The word does not exist in the list.');
        resetCurrentLineLetters();
      } else {
        console.error('Error while checking the word: ', error);
        alert('There was an error checking your word. Please try again.');
      }
    }
  }, [
    attemptsLeft,
    currentLine,
    currentWord,
    gameBoard,
    isLoading,
    resetCurrentLineLetters,
    updateGameBoardAfterSuccessfulGuess,
  ]);

  useEffect(() => {
    // TODO: Check if the last guess entered by the user is correct
    // If it is, then show a modal with the score and a button to start a new game

    if (attemptsLeft === 0 && !gameWon && !lose) {
      setLose(true);
      setShowModal(true);
      handleLose();
    }
  }, [attemptsLeft, gameWon, handleLose, lose]);

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
        // A letter key was pressed
        handleLetterClick(event.key.toLowerCase());
      } else if (event.key === 'Enter') {
        // The Enter key was pressed
        submitGuess();
      } else if (event.key === 'Backspace') {
        // The Backspace key was pressed
        handleResetClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleLetterClick, submitGuess, handleResetClick]);

  return (
    <div className="game-board min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-900" style={{paddingTop: '0px', paddingBottom: '70px'}}>
      {isLoading && <LoadingSpinner />}
      {gameWon && showModal && (
        <WinGameModal
          key={userStats.totalWins}
          resetGame={resetGame}
          closeModal={closeModal}
          userStats={userStats}
        />
      )}
      {gameWon && <Confetti className="animate-confetti" />}
      {gameWon && <Confetti className="animate-confetti" />}
      {lose && showModal && (
        <LoseGameModal
          key={userStats.totalWins}
          resetGame={resetGame}
          closeModal={closeModal}
          userStats={userStats}
        />
      )}
      <div className="p-8 space-y-2 bg-white shadow-md rounded-xl dark:bg-gray-800 dark:text-white">
        {gameBoard.map((row, i) => (
          <WordLine
            key={i}
            rowIndex={i}
            guess={row.letters}
            isSubmitted={row.isSubmitted}
            selectedBox={selectedBox}
          />
        ))}
        <div className="keyboard space-y-2">
          <div className="grid grid-cols-10 gap-1 w-full">
            {keyboard.slice(0, 10).map((letter, i) => (
              <button
                key={i}
                onClick={() => handleLetterClick(letter)}
                className={`text-lg px-3 py-3 rounded 
                                        ${
                                          isSubmitted &&
                                          guessedLetters.includes(letter) &&
                                          !currentWord.includes(letter)
                                            ? 'bg-gray-500 text-white'
                                            : 'bg-gray-400 text-white'
                                        }`}
              >
                {letter}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-9 gap-1 w-full">
            {keyboard.slice(10, 19).map((letter, i) => (
              <button
                key={i}
                onClick={() => handleLetterClick(letter)}
                className={`text-lg px-3 py-3 rounded 
                            ${
                              isSubmitted &&
                              guessedLetters.includes(letter) &&
                              !currentWord.includes(letter)
                                ? 'bg-gray-500 text-white'
                                : 'bg-gray-400 text-white'
                            }`}
              >
                {letter}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 w-full">
            {keyboard.slice(19).map((letter, i) => (
              <button
                key={i}
                onClick={() => handleLetterClick(letter)}
                className={`text-lg px-3 py-3 rounded 
                                        ${
                                          isSubmitted &&
                                          guessedLetters.includes(letter) &&
                                          !currentWord.includes(letter)
                                            ? 'bg-gray-500 text-white'
                                            : 'bg-gray-400 text-white'
                                        }`}
              >
                {letter}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-10 gap-1 w-full">
            <button
              onClick={handleResetClick}
              className="col-start-1 col-span-5 text-lg px-4 py-2 bg-red-500 text-white rounded"
            >
              Reset Selected Box
            </button>
            <button
              onClick={submitGuess}
              className="col-start-6 col-span-5 text-lg px-4 py-2 bg-green-500 text-white rounded"
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
