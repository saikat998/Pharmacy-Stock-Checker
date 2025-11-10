import React from 'react';

export default function Contact() {
  return (
    <div className="p-8 max-w-xl mx-auto bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl mt-12 border border-blue-100 dark:border-gray-800">
      <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 dark:from-blue-300 dark:via-purple-400 dark:to-pink-300">Contact</h2>
      <div className="space-y-6 text-xl">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Mobile:</span>
          <span className="font-extrabold text-2xl tracking-wide bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent drop-shadow-lg">+91 7029553373</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span>
          <span className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent drop-shadow-lg">saikat.pradhan2018@gmail.com</span>
        </div>
      </div>
      <div className="mt-8 text-center">
        <a href="mailto:saikat.pradhan2018@gmail.com" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 font-bold shadow-lg hover:scale-105 transition-transform duration-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-clip-text text-transparent drop-shadow-lg">
          <span className="font-extrabold text-2xl tracking-wide bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent">Feel free to contact us anytime!</span>
        </a>
      </div>
    </div>
  );
}
