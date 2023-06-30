// App.js
import React, { useState } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import ThemeContext from './components/ThemeContext';
import Header from './components/Header'; // import the Header component

function App() {
  const [theme, setTheme] = useState('dark'); // ou 'dark'

  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={darkMode ? 'dark App' : 'App'}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />{' '}
        <GameBoard />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
