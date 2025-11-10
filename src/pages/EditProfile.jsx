import React, { useState } from "react";

export default function EditProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfile((prev) => ({ ...prev, image: file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Save profile logic (API call)
    alert("Profile updated!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-2 sm:px-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col gap-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-2">Edit Profile</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-4">
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-300 to-purple-300 flex items-center justify-center shadow-lg overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-4xl text-white">🧑‍⚕️</span>
                )}
              </div>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <span className="text-xs text-gray-500 mt-2">Click to upload profile image</span>
          </div>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Pharmacy Name"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70 text-gray-700 text-base"
            required
          />
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70 text-gray-700 text-base"
            required
          />
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70 text-gray-700 text-base"
            required
          />
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70 text-gray-700 text-base"
            required
          />
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200 text-base sm:text-lg"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
