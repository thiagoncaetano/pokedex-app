import { useState } from 'react';
import { SortBy, SortByType } from '@/types/filters';

interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: { value: SortByType; label: string }[];
  selectedValue: SortByType;
  onSelectChange: (value: SortByType) => void;
}

export default function SortModal({ isOpen, onClose, title, options, selectedValue, onSelectChange }: SortModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
        setIsClosing(false);
      }, 150);
    }
  };

  const handleOptionClick = (value: SortByType) => {
    console.log('Clicked on:', options.find(opt => opt.value === value)?.label);
    setIsClosing(true);
    onSelectChange(value);
    
    // I added a small delay to show visual feedback before closing
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 150);
  };
  
  if (!isOpen && !isClosing) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-primary p-4 rounded-2xl shadow-2xl transition-all duration-300 transform ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Title in the outer card */}
        <h3 className="text-white font-semibold text-lg mb-4">{title}:</h3>
        
        {/* Inner card with full radius */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col gap-4">
              {options.map((option) => (
                <div 
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  onClick={() => handleOptionClick(option.value)}
                >
                  <div 
                    className={`w-4 h-4 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center relative ${
                      selectedValue === option.value ? 'scale-110' : 'scale-100'
                    }`}
                    style={{
                      backgroundColor: selectedValue === option.value ? '#DC0A2D' : '#FFFFFF',
                      borderColor: '#DC0A2D'
                    }}
                  >
                    {selectedValue === option.value && (
                      <div 
                        className="absolute inset-0 rounded-full border-2"
                        style={{ borderColor: '#FFFFFF' }}
                      ></div>
                    )}
                    {selectedValue === option.value && (
                      <div 
                        className="w-2 h-2 rounded-full z-10"
                        style={{ backgroundColor: '#DC0A2D' }}
                      ></div>
                    )}
                  </div>
                  <span className="text-gray-900 font-medium">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
