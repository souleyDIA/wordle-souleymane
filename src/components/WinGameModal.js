import React from 'react';

import { motion } from 'framer-motion';

const WinGameModal = ({ resetGame, userStats, closeModal }) => {
  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modal = {
    hidden: { y: '-100vh', opacity: 0 },
    visible: {
      y: '200px',
      opacity: 1,
      transition: { delay: 0.5 },
    },
  };

  return (
    <motion.div
      key={userStats.lastWord}
      className="fixed z-50 inset-0 overflow-y-auto"
      variants={backdrop}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <motion.div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          variants={modal}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <iframe
                title="win-game-gif"
                src="https://giphy.com/embed/cUKAiUSdzWEs8Zxkia"
                width="180"
                height="180"
                className="giphy-embed"
              ></iframe>
              <p>
                <a href="https://giphy.com/gifs/snowfallfx-cheers-winning-to-wars-cUKAiUSdzWEs8Zxkia" />
              </p>{' '}
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Congratulations! You won the game!
                </h3>
                <p>
                  The word was indeed:
                  <span className="font-semibold">{userStats.lastWord}</span>
                </p>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Performance per line:
                  </h3>
                  {userStats.linePerformance.map((value, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <p className="mr-2">
                        Line {index + 1}: {value === 2 ? value - 1 : value}
                      </p>
                      {value === 2 && (
                        <div className="flex items-center">
                          <div className="w-40 h-4 bg-green-600 rounded-full relative"></div>
                        </div>
                      )}
                      <div>
                        <img src="../assets/css/reaper.png" alt="" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Would you like to play again?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={resetGame}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Play Again
            </button>
            <button
              onClick={closeModal}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WinGameModal;
