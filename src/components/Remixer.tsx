import { useState } from 'react'

export function Remixer() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const remixOptions = [
    { id: 'formal', label: 'Make Formal' },
    { id: 'casual', label: 'Make Casual' },
    { id: 'funny', label: 'Make Funny' }
  ]

  const handleRemix = async (style: string) => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/remix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, style })
      })
      const data = await response.json()
      setOutputText(data.result)
    } catch (error) {
      console.error('Error:', error)
    }
    setIsLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Content Remixer</h1>
      
      <textarea
        className="w-full p-2 border rounded mb-4 h-32"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to remix..."
      />

      <div className="flex gap-2 mb-4">
        {remixOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleRemix(option.id)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading || !inputText}
          >
            {option.label}
          </button>
        ))}
      </div>

      {outputText && (
        <div className="border rounded p-4 bg-gray-50">
          <h2 className="font-bold mb-2">Remixed Content:</h2>
          <p>{outputText}</p>
        </div>
      )}
    </div>
  )
}
