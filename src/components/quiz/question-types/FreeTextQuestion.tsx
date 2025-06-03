import React from 'react';

interface FreeTextQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const FreeTextQuestion: React.FC<FreeTextQuestionProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <textarea
        className="w-full min-h-32 p-4 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
        placeholder="Type your answer here..."
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-sm text-gray-500">
        Be as specific or general as you'd like. Your honest response helps create accurate results.
      </p>
    </div>
  );
};

export default FreeTextQuestion;