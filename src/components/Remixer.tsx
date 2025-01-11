import { useState } from 'react'

export function Remixer() {
  const [inputText, setInputText] = useState('')
  const [outputOptions, setOutputOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const tweetOptions = [
    { id: 'short', label: 'Short Tweet' },
    { id: 'long', label: 'Long Tweet' },
    { id: 'thread', label: 'Thread' },
    { id: 'reply', label: 'Reply' }
  ]

  const handleRemix = async (format: string) => {
    if (!inputText) {
      setError('Please enter some text to convert');
      return;
    }
    setError(null);
    setOutputOptions([]);
    setIsLoading(true);
    setActiveButton(format);
    
    try {
      const response = await fetch('/api/remix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, format })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate options');
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      const options = data.results || (data.result ? data.result.split('\n').filter(Boolean) : null);
      
      if (!options || !Array.isArray(options)) {
        throw new Error('Invalid response format received');
      }

      setOutputOptions(options.filter(option => option.trim().length > 0));
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setOutputOptions([]);
    } finally {
      setIsLoading(false);
      setActiveButton(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-3xl flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1DA1F2] border-t-transparent"></div>
              <span className="mt-4 text-[#1DA1F2] dark:text-[#1D9BF0] font-medium">Generating options...</span>
            </div>
          </div>
        )}

        <textarea
          className="w-full p-4 border-2 border-[#1DA1F2] rounded-2xl mb-6 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-[#1DA1F2] 
          dark:bg-gray-700 dark:text-white dark:border-[#1D9BF0]"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter any text to convert..."
          disabled={isLoading}
        />

        <div className="grid grid-cols-2 gap-4 mb-6">
          {tweetOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleRemix(option.id)}
              disabled={isLoading}
              className={`px-6 py-3 bg-[#1DA1F2] text-white font-medium rounded-full transition-colors
              dark:bg-[#1D9BF0] ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#87CEEB] dark:hover:bg-[#1A8CD8]'}`}
            >
              {activeButton === option.id ? 'Creating...' : option.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border-2 border-red-400 dark:border-red-600 rounded-2xl text-red-700 dark:text-red-100">
            {error}
          </div>
        )}

        {outputOptions.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {outputOptions.map((option, index) => (
              <div 
                key={index}
                className="border-2 border-[#1DA1F2] dark:border-[#1D9BF0] rounded-2xl p-4 dark:bg-gray-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-[#1DA1F2] dark:text-[#1D9BF0]">Option {index + 1}</span>
                </div>
                <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap text-sm">{option}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
