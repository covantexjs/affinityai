import React from 'react';

interface LikertQuestionProps {
  labels?: {
    min: string;
    max: string;
  };
  selectedValue: number;
  onChange: (value: number) => void;
}

const LikertQuestion: React.FC<LikertQuestionProps> = ({
  labels = { min: 'Strongly Disagree', max: 'Strongly Agree' },
  selectedValue,
  onChange
}) => {
  const options = [1, 2, 3, 4, 5];
  
  return (
    <div className="pt-4">
      <div className="flex justify-between mb-2 text-sm text-gray-500">
        <span>{labels.min}</span>
        <span>{labels.max}</span>
      </div>
      
      <div className="flex justify-between gap-2 mb-6">
        {options.map((value) => (
          <button
            key={value}
            className={`w-full h-12 rounded-md transition-all 
              ${selectedValue === value 
                ? 'bg-primary-500 text-white font-medium' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            onClick={() => onChange(value)}
          >
            {value}
          </button>
        ))}
      </div>
      
      <div className="text-center mt-4">
        <p className="font-medium">
          {selectedValue ? (
            <>
              You selected: <span className="text-primary-500">{selectedValue}</span>
            </>
          ) : 'Select a value from 1-5'}
        </p>
      </div>
    </div>
  );
};

export default LikertQuestion;