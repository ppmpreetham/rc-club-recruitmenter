import { Upload } from 'lucide-react'

const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (event) => {
    console.log('File input changed:', event.target.files);
    onFileUpload(event);
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-lg p-8 mb-6">
      <div className="text-center">
        <Upload className="mx-auto h-16 w-16 text-pink-400 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Upload CSV File</h3>
        <p className="text-white mb-4">
          Upload the CSV
        </p>
        <input
          type="file"
          accept=".csv,text/csv,application/csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors cursor-pointer"
        >
          <Upload className="mr-2 h-5 w-5" />
          Choose CSV File
        </label>
      </div>
    </div>
  )
}

export default FileUpload