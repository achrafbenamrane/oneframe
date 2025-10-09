'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VEHICLE_TYPES, VehicleType } from '../constants/vehicles';

type VehicleOption = {
  id: VehicleType;
  label: string;
};

interface IDInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onValidSelection?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const IDInputField: React.FC<IDInputFieldProps> = ({
  value,
  onChange,
  onValidSelection,
  placeholder = "Enter vehicle ID (van, camaro, land rover, bike, f1, mercedes gtr)",
  className = ""
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState<VehicleOption[]>([...VEHICLE_TYPES]);

  // Filter suggestions based on input
  useEffect(() => {
    if (value.trim() === '') {
      setFilteredSuggestions([...VEHICLE_TYPES]);
    } else {
      const filtered = VEHICLE_TYPES.filter(vehicle =>
        vehicle.id.toLowerCase().includes(value.toLowerCase()) ||
        vehicle.label.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions([...filtered]);
    }
  }, [value]);

  // Validate input
  useEffect(() => {
    if (value.trim() === '') {
      setError(null);
      return;
    }

    const isValid = VEHICLE_TYPES.some(vehicle => vehicle.id === value.toLowerCase());
    if (isValid) {
      setError(null);
      onValidSelection?.(value.toLowerCase());
    } else {
      setError('Please select a valid vehicle ID from the suggestions');
    }
  }, [value, onValidSelection]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (vehicleId: string) => {
    onChange(vehicleId);
    setShowSuggestions(false);
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 pr-10 text-sm sm:text-base
            border-2 rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            dark:focus:ring-offset-gray-800
            ${error
              ? 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400'
              : isFocused
                ? 'border-blue-500 focus:ring-blue-500 dark:border-blue-400 dark:focus:ring-blue-400'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
            }
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
          `}
          aria-describedby={error ? "error-message" : undefined}
          aria-invalid={error ? "true" : "false"}
        />
        
        {/* Search Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            className="w-5 h-5 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            id="error-message"
            className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredSuggestions.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => handleSuggestionClick(vehicle.id)}
                className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 dark:text-white font-medium">
                    {vehicle.label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                    {vehicle.id}
                  </span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Valid Selection Indicator */}
      {value && !error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center space-x-1"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Valid selection</span>
        </motion.div>
      )}
    </div>
  );
};

export default IDInputField;
