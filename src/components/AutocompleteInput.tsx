import { useState, useRef, useEffect } from 'react';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label: string;
}

export default function AutocompleteInput({ value, onChange, options, placeholder, label }: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          setIsFocused(true);
          setIsOpen(true);
        }}
        className="glass-input w-full"
        placeholder={placeholder}
        required
      />
      
      {isOpen && isFocused && filteredOptions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-slate-800 border border-slate-700 rounded-lg shadow-xl custom-scrollbar">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-primary/20 hover:text-primary cursor-pointer text-sm text-slate-200 transition-colors"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
