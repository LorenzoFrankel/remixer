import { Remixer } from './components/Remixer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#1DA1F2] dark:text-[#1D9BF0]">
          Convert any content to Tweets
        </h1>
        <Remixer />
      </div>
    </div>
  )
}

export default App
