import React from 'react';

const Keyboard = ({ handleLetterClick, keyboard, isSubmitted, guessedLetters, currentWord }) => {
  return (
    <div className="keyboard grid grid-cols-10 gap-1 w-full">
      {keyboard.map((letter, i) => (
        <button 
            key={i} 
            onClick={() => handleLetterClick(letter)}
            className={`text-lg px-3 py-3 rounded 
                    ${isSubmitted && guessedLetters.includes(letter) && !currentWord.includes(letter) 
                        ? 'bg-gray-500 text-white' : 'bg-gray-400 text-white'}`
                    }
            >
                {letter}
        </button>
      ))}
    </div>
  );
};

export default Keyboard;
