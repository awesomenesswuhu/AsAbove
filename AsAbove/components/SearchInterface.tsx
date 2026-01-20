"use client";

import { useState, FormEvent } from "react";
import { Search, Loader2, Check, X } from "lucide-react";

interface SearchInterfaceProps {
  onSearch: (pincode: string) => void;
  isLoading: boolean;
  compact?: boolean;
}

export default function SearchInterface({ onSearch, isLoading, compact = false }: SearchInterfaceProps) {
  const [pincode, setPincode] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validatePincode = (code: string): boolean => {
    // Support international postal codes: 3-10 alphanumeric characters (may include spaces/hyphens)
    const cleanedCode = code.replace(/[\s-]/g, "");
    return cleanedCode.length >= 3 && cleanedCode.length <= 10 && /^[A-Za-z0-9]+$/.test(cleanedCode);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // Allow alphanumeric and spaces/hyphens for international codes
    setPincode(value);
    
    if (value.length >= 3) {
      setIsValid(validatePincode(value));
    } else {
      setIsValid(null);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isValid && !isLoading) {
      onSearch(pincode);
    }
  };

  const handleClear = () => {
    setPincode("");
    setIsValid(null);
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${compact ? "max-w-none flex items-center gap-2" : "max-w-md mx-auto"}`}>
      <div className={`relative ${compact ? "flex-grow" : ""}`}>
        <input
          type="text"
          value={pincode}
          onChange={handleChange}
          placeholder={compact ? "Postal code" : "Enter your postal code (e.g., 10001, SW1A 1AA, M5H 2N2)"}
          disabled={isLoading}
          className={`w-full ${compact ? "px-3 py-2 pl-8 text-sm pr-4" : "px-4 py-3 pl-12 pr-4 text-lg"} text-white bg-white/10 backdrop-blur-xl border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderColor:
              isValid === null
                ? "rgba(255, 255, 255, 0.3)"
                : isValid
                ? "rgba(34, 197, 94, 0.5)"
                : "rgba(239, 68, 68, 0.5)",
          }}
          aria-label="Enter your postal code"
        />
        
        <div className={`absolute left-2 top-1/2 -translate-y-1/2 text-white/50 ${compact ? "left-2" : "left-4"}`}>
          <Search size={compact ? 16 : 20} />
        </div>
      </div>

      {!compact && isValid === false && pincode.length >= 3 && (
        <p className="mt-2 text-sm text-red-400 text-center">
          Please enter a valid postal code
        </p>
      )}

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className={`mt-0 ${compact ? "w-auto px-4 py-2 text-sm whitespace-nowrap" : "w-full mt-8 px-6 py-3"} bg-white/10 backdrop-blur-xl border border-white/30 disabled:bg-white/5 disabled:border-white/10 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:transform-none hover:bg-white/15 shadow-lg`}
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={compact ? 16 : 20} className="animate-spin" />
            {compact ? "" : "Finding your location..."}
          </span>
        ) : (
          "Explore Sky"
        )}
      </button>
    </form>
  );
}
