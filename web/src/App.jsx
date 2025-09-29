import { useState } from 'react';
import Papa from 'papaparse';
import SwipeCard from './components/SwipeCard';
import FileUpload from './components/FileUpload';
import CandidateCard from './components/CandidateCard';
import CompletionScreen from './components/CompletionScreen';
import useKeyboardHandler from './hooks/useKeyboardHandler';
import "./index.css";

const CSVTinder = () => {
  const [csvData, setCsvData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accepted, setAccepted] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('Selected file:', file); // Debug log
    
    if (!file) {
      console.log('No file selected');
      return;
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      alert('Please select a CSV file');
      return;
    }

    setUploadedFileName(file.name);
    console.log('Starting to parse file:', file.name); // Debug log

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      delimitersToGuess: [',', '\t', '|', ';'],
      complete: (result) => {
        console.log('Parse complete:', result); // Debug log
        
        if (result.errors && result.errors.length > 0) {
          console.error('Parse errors:', result.errors);
        }
        
        const cleanedData = result.data.map(row => {
          const cleanedRow = {};
          Object.keys(row).forEach(key => {
            const cleanKey = key.trim();
            cleanedRow[cleanKey] = row[key];
          });
          return cleanedRow;
        });
        
        console.log('Cleaned data:', cleanedData); // Debug log
        setCsvData(cleanedData);
        setCurrentIndex(0);
        setAccepted([]);
        setRejected([]);
      },
      error: (error) => {
        console.error('Parse error:', error);
        alert('Error parsing CSV: ' + error.message);
      }
    });

    // Reset the input value to allow re-uploading the same file
    event.target.value = '';
  };

  const handleSwipe = (direction) => {
    if (isAnimating || currentIndex >= csvData.length) return;

    setIsAnimating(true);
    const currentCandidate = { ...csvData[currentIndex], originalIndex: currentIndex };

    if (direction === 'right') {
      setAccepted(prev => [...prev, currentCandidate]);
    } else {
      setRejected(prev => [...prev, currentCandidate]);
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 100);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setAccepted([]);
    setRejected([]);
    setIsAnimating(false);
  };

  const downloadResults = () => {
    const results = {
      accepted: accepted,
      rejected: rejected,
      summary: {
        total: csvData.length,
        accepted: accepted.length,
        rejected: rejected.length,
        remaining: csvData.length - currentIndex
      }
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tinder_results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentCandidate = csvData[currentIndex];
  const isComplete = currentIndex >= csvData.length && csvData.length > 0;

  useKeyboardHandler();

  return (
    
    <div className="min-h-screen bg-black text-white overflow-x-hidden space">
      <div className="container mx-auto px-4 pt-8 pb-4 max-w-4xl ">
        <div className="text-start ml-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 instrument">RC Club Recruitments</h1>
          <div className='text-white'>{uploadedFileName ? uploadedFileName: ""}</div>
        </div>

        {csvData.length === 0 && (
          <FileUpload onFileUpload={handleFileUpload} />
        )}

        {!isComplete && currentCandidate && (
          <div className="relative h-[80vh] mb-6">
            <SwipeCard onSwipe={handleSwipe} disabled={isAnimating}>
              <CandidateCard
                candidate={currentCandidate}
                currentIndex={currentIndex}
                totalCandidates={csvData.length}
              />
            </SwipeCard>
          </div>
        )}

        {isComplete && (
          <CompletionScreen
            accepted={accepted.length}
            rejected={rejected.length}
            totalCandidates={csvData.length}
            onReset={handleReset}
            onDownload={downloadResults}
          />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return <CSVTinder />;
}