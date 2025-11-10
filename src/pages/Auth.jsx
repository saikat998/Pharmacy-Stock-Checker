import React, { useState } from "react";
import "../App.css";

const accentColor = "#7494ec";

const socialIcons = [
  { name: "Google", icon: "G", color: "#DB4437" },
  { name: "Facebook", icon: "F", color: "#4267B2" },
  { name: "GitHub", icon: "GH", color: "#333" },
  { name: "LinkedIn", icon: "IN", color: "#0077B5" },
];

export default function AuthForm({ onAuth, error, mode, setMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Always call onAuth(email, password). App.jsx expects (email, password).
    onAuth(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-2 sm:px-4">
      <div className="relative w-full max-w-2xl min-h-[600px] flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden border border-blue-200">
        {/* Animated Blue Panel */}
        <div className={`absolute top-0 left-0 h-full w-full md:w-1/2 bg-gradient-to-br from-[#7494ec] via-blue-400 to-purple-400 transition-all duration-[1800ms] ease-in-out z-10 flex flex-col items-center justify-center text-white rounded-b-3xl md:rounded-r-[80px] md:rounded-b-none shadow-2xl ${mode === 'signup' ? 'md:translate-x-full translate-y-full md:translate-y-0' : ''}`}
          style={{ borderTopRightRadius: 80, borderBottomRightRadius: 80 }}>
          <div className="px-4 sm:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 drop-shadow-xl tracking-tight">{mode === 'login' ? 'Welcome Back!' : 'Hello, Welcome!'}</h2>
            <p className="text-base sm:text-lg mb-8 font-medium opacity-90">{mode === 'login' ? 'Sign in to your account' : 'Create your account to get started'}</p>
            {mode === 'signup' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="px-6 py-2 sm:px-8 sm:py-3 rounded-xl bg-white text-[#7494ec] font-bold shadow-lg hover:scale-105 transition-transform duration-300 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              >
                Already have an account?
              </button>
            )}
          </div>
        </div>
        {/* Form Area */}
  <div className={`relative w-full bg-white flex flex-col justify-center items-center p-4 sm:p-8 z-20 transition-all duration-[1800ms] ease-in-out`} style={{ borderRadius: 24 }}>
          <div className="flex flex-col items-center mb-6">
            <div className="text-4xl sm:text-5xl mb-2 animate-bounce">🧪</div>
            <h2 className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7494ec] via-purple-500 to-pink-400 mb-2 text-center drop-shadow-xl tracking-tight">
              PharmaCare
            </h2>
            <p className="text-gray-500 text-center font-medium text-xs sm:text-base">Advanced Pharmacy Management System</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 w-full">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 sm:p-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-[#7494ec]"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 sm:p-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-[#7494ec]"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-[#7494ec] font-bold underline hover:text-blue-600 transition-colors text-sm sm:text-base"
                  >
                    Already have an account?
                  </button>
                </div>
              </>
            )}
            {mode === "login" && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 sm:p-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-[#7494ec]"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 sm:p-3 border rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-[#7494ec]"
                    placeholder="Enter your password"
                  />
                </div>
                {/* Only show New User? below the form, not in the blue panel */}
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-[#7494ec] font-bold underline hover:text-blue-600 transition-colors text-sm sm:text-base"
                  >
                    New User?
                  </button>
                </div>
              </>
            )}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              className="w-full py-2 sm:py-3 bg-[#7494ec] text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:scale-105 transition-transform"
            >
              {mode === "login" ? "Sign In to Dashboard" : "Create Account"}
            </button>
          </form>
          <div className="mt-6 flex justify-center gap-2 sm:gap-4 flex-wrap">
            {socialIcons.map((icon) => (
              <button
                key={icon.name}
                type="button"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 border border-blue-200 hover:bg-blue-200 transition-colors text-xl sm:text-2xl"
                style={{ color: icon.color }}
                aria-label={icon.name}
              >
                {icon.icon}
              </button>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center text-xs sm:text-sm text-gray-500">
            <div className="flex gap-1 sm:gap-2 mb-2 flex-wrap justify-center">
              <span className="flex items-center gap-1">
                <span className="text-base sm:text-lg">📊</span>Smart Analytics
              </span>
              <span className="flex items-center gap-1">
                <span className="text-base sm:text-lg">📅</span>Expiry Tracking
              </span>
              <span className="flex items-center gap-1">
                <span className="text-base sm:text-lg">🔒</span>Secure & Reliable
              </span>
            </div>
            <span>
              Trusted by pharmacists worldwide • Built with <span className="text-pink-400">❤️</span> for healthcare
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
