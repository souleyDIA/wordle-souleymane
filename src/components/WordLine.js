import React from "react";
import LetterBox from "./LetterBox";

const WordLine = ({ guess, isSubmitted, selectedBox, rowIndex }) => {
  return (
    <div className="word-line">
      {guess.map((letterStatus, index) => (
        <LetterBox
          key={index}
          letterObj={letterStatus}
          isSubmitted={isSubmitted}
          rowIndex={rowIndex}
          colIndex={index}
          selectedBox={selectedBox}
        />
      ))}
    </div>
  );
};

export default WordLine;
