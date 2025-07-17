import React from 'react';

interface MultipleChoiceQuestionProps {
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  options,
  selectedValue,
  onChange
}) => {
  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border-2 transition-all cursor-pointer
          ${selectedValue === option 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
          onClick={() => onChange(option)}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${selectedValue === option 
                ? 'border-primary-500' 
                : 'border-gray-300'}`}
            >
              {selectedValue === option && (
                <div className="w-3 h-3 rounded-full bg-primary-500" />
              )}
            </div>
            <span className={selectedValue === option ? 'font-medium' : ''}>{option}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MultipleChoiceQuestion;