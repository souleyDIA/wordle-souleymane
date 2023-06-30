import React from 'react';

const Controls = ({ handleResetClick, submitGuess }) => {
  return (
    <div className="controls flex justify-between mt-5 w-full px-3">
      <button 
          onClick={handleResetClick}
          className="text-lg px-4 py-2 bg-red-500 text-white rounded"
      >
          Reset Selected Box
      </button>
      <button 
          onClick={submitGuess}
          className="mt-5 text-lg px-4 py-2 bg-green-500 text-white rounded"
      >
          Submit
      </button>
    </div>
  );
};

export default Controls;
