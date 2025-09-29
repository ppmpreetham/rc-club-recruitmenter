import { RotateCcw, Download } from 'lucide-react'

const CompletionScreen = ({ accepted, rejected, totalCandidates, onReset, onDownload }) => {
  return (
    <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 text-center">
      <div className="mb-6">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-white mb-2">Review Complete!</h2>
        <p className="text-white">You've reviewed all {totalCandidates} candidates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 rounded-xl p-6">
          <div className="text-3xl font-bold text-green-600">{accepted}</div>
          <div className="text-green-800">Accepted</div>
        </div>
        <div className="bg-red-50 rounded-xl p-6">
          <div className="text-3xl font-bold text-red-600">{rejected}</div>
          <div className="text-red-800">Rejected</div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={onReset}
          className="inline-flex items-center px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Review Again
        </button>
        <button
          onClick={onDownload}
          className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-full hover:blue-600 transition-colors"
        >
          <Download className="mr-2 h-5 w-5" />
          Download Results
        </button>
      </div>
    </div>
  )
}

export default CompletionScreen