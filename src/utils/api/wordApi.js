const fetchRandomWord = async () => {
  try {
    const response = await fetch("https://api.datamuse.com/words?sp=?????");
    const data = await response.json();
    const words = data.map((wordObj) => wordObj.word);
    const randomWord = words[Math.floor(Math.random() * words.length)];
    return randomWord;
  } catch (error) {
    console.error("Failed to fetch word:", error);
    throw error;
  }
};

export default fetchRandomWord;
