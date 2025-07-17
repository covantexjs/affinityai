import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, AlertCircle, Loader2, Code } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface FunctionTesterProps {
  className?: string;
}

const FunctionTester: React.FC<FunctionTesterProps> = ({ className = '' }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runTest = async () => {
    setIsRunning(true);
    setResults(null);

    try {
      const response = await fetch('/.netlify/functions/supabase-operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Test User',
          answer: 'Test Answer'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setResults({
        type: 'success',
        data: result,
        message: 'Function call successful!'
      });
    } catch (error: any) {
      setResults({
        type: 'error',
        message: error.message,
        error: error
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Function Tester
          </h3>
          <p className="text-gray-600">
            Test your Netlify functions to ensure they're working correctly
          </p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Function Test</h4>
          <p className="text-sm text-blue-700">
            Tests the supabase-operation function with sample data (name: "Test User", answer: "Test Answer")
          </p>
        </div>

        <div className="mb-6">
          <Button
            onClick={runTest}
            disabled={isRunning}
            className="w-full"
            size="lg"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Running Test...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Run Test
              </>
            )}
          </Button>
        </div>

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className={`p-4 rounded-lg border flex items-start gap-3 ${
              results.type === 'success' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              {results.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              )}
              <div className="flex-1">
                <h5 className={`font-semibold ${
                  results.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {results.message}
                </h5>
                
                {results.data && (
                  <div className="mt-3">
                    <details className="cursor-pointer">
                      <summary className={`text-sm font-medium ${
                        results.type === 'success' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        <Code className="w-4 h-4 inline mr-1" />
                        View Response Data
                      </summary>
                      <pre className={`mt-2 p-3 rounded text-xs overflow-auto ${
                        results.type === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {JSON.stringify(results.data, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
};

export default FunctionTester;