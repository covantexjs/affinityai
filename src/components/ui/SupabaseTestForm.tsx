import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface SupabaseTestFormProps {
  className?: string;
}

const SupabaseTestForm: React.FC<SupabaseTestFormProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    answer: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.answer.trim()) {
      setResult({
        type: 'error',
        message: 'Please fill in both name and answer fields'
      });
      return;
    }

    setIsSubmitting(true);
    setResult({ type: null, message: '' });

    try {
      const response = await fetch('/.netlify/functions/supabase-operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          answer: formData.answer.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();

      if (responseData.success) {
        setResult({
          type: 'success',
          message: responseData.message || 'Data submitted successfully!'
        });
        setFormData({ name: '', answer: '' });
      } else {
        setResult({
          type: 'error',
          message: responseData.error || 'Submission failed'
        });
      }
    } catch (error: any) {
      setResult({
        type: 'error',
        message: error.message || 'Failed to submit data'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestSubmit = async () => {
    setFormData({
      name: 'Test User',
      answer: 'This is a test submission'
    });
    
    setTimeout(() => {
      const form = document.getElementById('supabase-test-form') as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Test Supabase Function
          </h3>
          <p className="text-gray-600">
            Submit test data to verify your Supabase integration is working
          </p>
        </div>

        <form id="supabase-test-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="test-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="test-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label htmlFor="test-answer" className="block text-sm font-medium text-gray-700 mb-1">
              Answer
            </label>
            <textarea
              id="test-answer"
              value={formData.answer}
              onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your answer"
              rows={3}
              required
            />
          </div>

          {result.type && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg border flex items-center gap-2 ${
                result.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {result.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{result.message}</span>
            </motion.div>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Data
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleTestSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              Fill Test Data
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Data is sent to the Netlify function at <code>/.netlify/functions/supabase-operation</code></li>
            <li>The function validates the data and inserts it into the Supabase database</li>
            <li>You'll see a success or error message based on the result</li>
            <li>Check your Supabase dashboard to see the inserted data</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default SupabaseTestForm;