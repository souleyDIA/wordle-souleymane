import React, { useContext } from 'react';
import Modal from 'react-modal';
import ThemeContext from './ThemeContext';

import { FaTimes } from 'react-icons/fa'; // Import the 'X' icon


// Ce composant représente une lettre individuelle avec une couleur de fond
function ColoredLetterBox({ letter, color }) {
  return (
    <div
      className={`inline-block w-8 h-8 mr-1 rounded text-center leading-8 ${color}`}
    >
      {letter}
    </div>
  );
}

// Ce composant représente une ligne de lettre individuelles avec différentes couleurs
function ExampleLine({ word, colorPattern }) {
  return (
    <div className="mb-2">
      {word.split('').map((letter, i) => (
        <ColoredLetterBox letter={letter} color={colorPattern[i]} key={i} />
      ))}
    </div>
  );
}

Modal.setAppElement('#root'); // replace '#root' with the id of your app's root div

function HelpModal({ onClose }) {
  const { theme } = useContext(ThemeContext);

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      className={`${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
      } max-w-full h-full sm:max-w-md md:max-w-lg lg:max-w-lg xl:max-w-xl mx-auto p-4 rounded-md mt-10 sm:mt-4 overflow-auto fixed inset-0 sm:relative sm:rounded-lg`}
    >
      <button onClick={onClose} className="absolute right-3 top-3">
        <FaTimes size={20} />
      </button>
      <h2 className="font-bold text-2xl mb-4">Game Rules</h2>
      <p className="mb-2">
        The goal of the game is to guess a 5-letter word chosen randomly.
      </p>
      <ul className="list-disc ml-10 my-8 mb-4">
        <li className="my-4">
          If a letter is correctly placed, it will be colored in green.
          <ExampleLine
            word="WORDL"
            colorPattern={[
              'bg-green-500',
              'bg-gray-700',
              'bg-gray-700',
              'bg-gray-700',
              'bg-gray-700',
            ]}
          />
        </li>
        <li className="my-4">
          If a letter is misplaced, it will be colored in yellow.
          <ExampleLine
            word="DROWL"
            colorPattern={[
              'bg-gray-700',
              'bg-gray-700',
              'bg-yellow-500',
              'bg-gray-700',
              'bg-gray-700',
            ]}
          />
        </li>
        <li className="my-4">
          If a letter is not in the word, it will remain gray.
          <ExampleLine
            word="ABCDE"
            colorPattern={[
              'bg-gray-700',
              'bg-gray-700',
              'bg-gray-700',
              'bg-gray-700',
              'bg-gray-500',
            ]}
          />
        </li>
      </ul>
      <p>You have 6 shots to guess the word. Good luck 😉!</p>

      <h2 className="font-bold text-2xl mb-4 mt-6">Credits</h2>
      <p className="list-disc ml-1 mb-1">
        Inspired by the{' '}
        <a
          href="https://twitter.com/powerlanguish" // Replace this with the actual twitter link
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600"
        >
          @Josh Wardle's
        </a>{' '}
        original Wordle game.
      </p>
      {/* <p className="list-disc ml-1 mb-1">
        Thanks to{' '}
        <a
          href="https://instagram.com/nwarmomo?igshid=MzRlODBiNWFlZA==" // Replace this with the actual twitter link
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600"
        >
          @nwarmomo
        </a>{' '}
        who designed the logo.
      </p> */}

      <h2 className="font-bold text-2xl mb-4 mt-6">Contact Developer</h2>
      <p>
        This game was developed by Souleymane DIA. For any queries, suggestions
        or bug reports, please reach out via:
      </p>
      <ul className="list-disc ml-5 mb-2">
        <li>Email: diasouleymane896@gmail.com</li>
      </ul>
    </Modal>
  );
}

export default HelpModal;
