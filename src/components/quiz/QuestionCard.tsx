import React from 'react';
import { motion } from 'framer-motion';
import { QuizQuestion } from '../../types/quiz';
import Card from '../ui/Card';
import MultipleChoiceQuestion from './question-types/MultipleChoiceQuestion';
import LikertQuestion from './question-types/LikertQuestion';
import FreeTextQuestion from './question-types/FreeTextQuestion';

interface QuestionCardProps {
  question: QuizQuestion;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, value, onChange }) => {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full"
    >
      <Card className="w-full max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">{question.text}</h2>
        
        {question.type === 'multiple-choice' && question.options && (
          <MultipleChoiceQuestion
            options={question.options}
            selectedValue={value as string}
            onChange={onChange}
          />
        )}
        
        {question.type === 'likert' && (
          <LikertQuestion
            labels={question.likertLabels}
            selectedValue={value as number}
            onChange={(value) => onChange(value)}
          />
        )}
        
        {question.type === 'free-text' && (
          <FreeTextQuestion
            value={value as string}
            onChange={onChange}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default QuestionCard;