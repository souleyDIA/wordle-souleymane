import React, { useContext, useState } from 'react';
import ThemeContext from './ThemeContext';
import HelpModal from './HelpModal';
import { FaQuestionCircle, FaSun, FaMoon } from 'react-icons/fa'; 
import Logo from '../assets/css/logo.png';  

function Header({ darkMode, toggleDarkMode }) {
  const { theme } = useContext(ThemeContext);
  const [showHelp, setShowHelp] = useState(false);

  const handleShowHelp = () => {
    setShowHelp(true);
  };

  const handleCloseHelp = () => {
    setShowHelp(false);
  };

  const headerClass =
    theme === 'dark'
      ? 'from-gray-800 text-white'
      : 'from-white to-gray-100 text-black';

  return (
    <header
      className={`w-full flex justify-center items-center ${headerClass}`}
    >
      <button
        onClick={toggleDarkMode}
        className={`text-lg p-2 rounded shadow hover:shadow-md transition-colors duration-300 ease-in-out mx-16 ${
          darkMode
            ? 'bg-white text-black hover:bg-gray-200'
              : 'bg-black text-white hover:bg-gray-700'
        }`}
      >
        {darkMode ? <FaMoon size={24} /> : <FaSun size={24} />}
      </button>

      <div className="flex-grow-0 flex items-center justify-center mx-16">
        <img src={Logo} alt="Logo" style={{ maxHeight: 100, width: "auto" }} />
      </div>

      <button
        className="text-lg p-2 rounded shadow hover:shadow-md transition-colors duration-300 ease-in-out bg-black text-white hover:bg-gray-700 mx-16"
        onClick={handleShowHelp}
      >
        <FaQuestionCircle size={24} />
      </button>

      {showHelp && <HelpModal onClose={handleCloseHelp} />}
    </header>
  );
}

export default Header;
