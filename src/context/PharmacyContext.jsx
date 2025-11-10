import React, { createContext, useContext, useReducer, useEffect } from 'react';
// Temporarily comment out Firebase imports
// import { 
//   collection, 
//   getDocs, 
//   addDoc, 
//   updateDoc, 
//   deleteDoc, 
//   doc,
//   onSnapshot 
// } from 'firebase/firestore';
// import { db } from '../firebase';
import { sampleMedicines, samplePharmacyInfo } from '../utils/sampleData';

const PharmacyContext = createContext();

// Actions
const ACTIONS = {
  SET_MEDICINES: 'SET_MEDICINES',
  ADD_MEDICINE: 'ADD_MEDICINE',
  UPDATE_MEDICINE: 'UPDATE_MEDICINE',
  DELETE_MEDICINE: 'DELETE_MEDICINE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_PHARMACY_INFO: 'SET_PHARMACY_INFO',
};

// Reducer
const pharmacyReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_MEDICINES:
      return { ...state, medicines: action.payload, loading: false };
    case ACTIONS.ADD_MEDICINE:
      return { ...state, medicines: [...state.medicines, action.payload] };
    case ACTIONS.UPDATE_MEDICINE:
      return {
        ...state,
        medicines: state.medicines.map(med =>
          med.id === action.payload.id ? action.payload : med
        ),
      };
    case ACTIONS.DELETE_MEDICINE:
      return {
        ...state,
        medicines: state.medicines.filter(med => med.id !== action.payload),
      };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_PHARMACY_INFO:
      return { ...state, pharmacyInfo: action.payload };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  medicines: sampleMedicines,
  pharmacyInfo: samplePharmacyInfo,
  loading: false,
  error: null,
};

export const PharmacyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pharmacyReducer, initialState);

  // Load sample medicines (temporarily replace Firebase)
  useEffect(() => {
    // Data is already loaded in initialState, no need for additional loading
    console.log('PharmacyContext initialized with sample data');
  }, []);

  // Add medicine (temporarily use local state)
  const addMedicine = async (medicineData) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      // Generate a simple ID
      const newMedicine = {
        ...medicineData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      dispatch({ type: ACTIONS.ADD_MEDICINE, payload: newMedicine });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return newMedicine.id;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Update medicine (temporarily use local state)
  const updateMedicine = async (id, medicineData) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const updatedMedicine = {
        ...medicineData,
        id,
        updatedAt: new Date(),
      };
      dispatch({ type: ACTIONS.UPDATE_MEDICINE, payload: updatedMedicine });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Delete medicine (temporarily use local state)
  const deleteMedicine = async (id) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: ACTIONS.DELETE_MEDICINE, payload: id });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Update pharmacy info
  const updatePharmacyInfo = (info) => {
    dispatch({ type: ACTIONS.SET_PHARMACY_INFO, payload: info });
  };

  const value = {
    ...state,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    updatePharmacyInfo,
  };

  return (
    <PharmacyContext.Provider value={value}>
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
