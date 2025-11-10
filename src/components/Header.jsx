import React from 'react';

const Header = ({ title }) => (
  <header className="w-full py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center shadow-lg mb-8 rounded-b-3xl">
    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-xl">{title}</h1>
  </header>
);

export default Header;
