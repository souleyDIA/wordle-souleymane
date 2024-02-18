import React, { useEffect, useState } from "react";

const LetterBox = ({
  letterObj,
  isSubmitted,
  index,
  selectedBox,
  colIndex,
  rowIndex,
}) => {
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      // Start the rotation after a delay based on the index
      setTimeout(() => setIsRotating(true), index * 200);
    } else {
      setIsRotating(false);
    }
  }, [isSubmitted, index]);

  const getLetterBoxStyle = () => {
    if (!isSubmitted) {
      return "border border-gray-300";
    }

    switch (letterObj.status) {
      case "correct":
        return "bg-green-500 text-white";
      case "wrong-position":
        return "bg-yellow-500 text-white";
      case "incorrect":
        return "bg-gray-300 text-white";
      default:
        return "";
    }
  };

  return (
    <div
      className={`w-12 h-12 flex items-center justify-center text-lg rounded-md
                        ${getLetterBoxStyle()} ${
        isRotating ? "animate-rotateY" : ""
      } 
                        ${
                          selectedBox?.letterIndex === colIndex &&
                          selectedBox?.line === rowIndex
                            ? "border-2 border-blue-500"
                            : ""
                        }`}
    >
      {letterObj.letter}
    </div>
  );
};

export default LetterBox;
