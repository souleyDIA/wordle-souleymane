export const isValidGuessWord = (word) => {
  if (word.length < 5) {
    alert("Please enter a word with 5 letters.");
    return false;
  }
  return true;
};

export async function checkWordValidity(word, apiKey) {
  const response = await fetch(
    `https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&includeRelated=false&useCanonical=false&includeTags=false&api_key=${apiKey}`
  );
  const data = await response.json();
  return data.length !== 0;
}

export const initializeGameBoard = () =>
  Array.from({ length: 6 }, () => ({
    letters: Array.from({ length: 5 }, () => ({
      letter: "",
      isSelected: false,
    })),
    isSubmitted: false,
  }));
