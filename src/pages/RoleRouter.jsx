import React, { useState } from "react";

export default function RoleRouter() {
  const [portal, setPortal] = useState("");
  const [adminType, setAdminType] = useState("");
  const [step, setStep] = useState(0);

  // Placeholder login/register logic
  const handleAdminLogin = (type) => {
    // TODO: Check credentials from Firestore
    if (type === "pharmacy") {
      window.location.href = "/pharmacy-dashboard"; // Replace with router navigation
    } else if (type === "doctor") {
      window.location.href = "/doctor-dashboard";
    }
  };
  const handlePatientRegister = () => {
    // TODO: Register new patient in Firebase
    window.location.href = "/patient-dashboard";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <h1 className="text-3xl font-bold mb-8">Welcome to PharmaCare Portal</h1>
      {!portal && (
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <button className="py-4 rounded-xl bg-blue-500 text-white font-semibold shadow hover:scale-105 transition" onClick={() => setPortal("admin")}>Login to Admin Portal</button>
          <button className="py-4 rounded-xl bg-purple-500 text-white font-semibold shadow hover:scale-105 transition" onClick={() => setPortal("patient")}>New User Portal</button>
        </div>
      )}
      {portal === "admin" && !adminType && (
        <div className="mt-8 w-full max-w-md flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-4">Select Admin Type</h2>
          <button className="py-3 rounded-xl bg-green-500 text-white font-semibold shadow hover:scale-105 transition" onClick={() => setAdminType("pharmacy")}>Pharmacy</button>
          <button className="py-3 rounded-xl bg-pink-500 text-white font-semibold shadow hover:scale-105 transition" onClick={() => setAdminType("doctor")}>Doctor</button>
        </div>
      )}
      {portal === "admin" && adminType && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">{adminType.charAt(0).toUpperCase() + adminType.slice(1)} Login</h2>
          {/* TODO: Replace with actual login form, check credentials from Firestore */}
          <form onSubmit={e => { e.preventDefault(); handleAdminLogin(adminType); }} className="flex flex-col gap-4">
            <input type="text" placeholder="User ID" className="px-4 py-2 rounded-xl border" required />
            <input type="password" placeholder="Password" className="px-4 py-2 rounded-xl border" required />
            <button type="submit" className="py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:scale-105 transition">Login</button>
          </form>
        </div>
      )}
      {portal === "patient" && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">Patient Registration</h2>
          {/* TODO: Replace with actual registration form, create new user in Firebase */}
          <form onSubmit={e => { e.preventDefault(); handlePatientRegister(); }} className="flex flex-col gap-4">
            <input type="text" placeholder="Full Name" className="px-4 py-2 rounded-xl border" required />
            <input type="email" placeholder="Email" className="px-4 py-2 rounded-xl border" required />
            <input type="password" placeholder="Password" className="px-4 py-2 rounded-xl border" required />
            <button type="submit" className="py-3 rounded-xl bg-purple-600 text-white font-semibold shadow hover:scale-105 transition">Register</button>
          </form>
        </div>
      )}
    </div>
  );
}
