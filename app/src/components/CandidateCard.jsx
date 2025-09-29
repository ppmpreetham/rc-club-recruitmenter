import React from "react"
const CandidateCard = ({ candidate, currentIndex, totalCandidates }) => {
  const getQuestions = (candidate) => {
    if (!candidate) return []
    const standardFields = ['name', 'email', 'mobile_number', 'registration_number']
    return Object.entries(candidate).filter(([key]) => 
      !standardFields.includes(key.toLowerCase()) && key !== 'originalIndex'
    )
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4 ">
        <div className="grid grid-cols-1 px-2 ">
            <div className="flex flex-row justify-between items-center">
                <h2 className="text-4xl instrument text-white">
                  {candidate.name || 'N/A'}
                </h2>
                <div>{currentIndex + 1} / {totalCandidates}</div>
            </div>
            <p className="text-white text-lg uppercase">{candidate.registration_number || 'N/A'}</p>
            <p className="text-white text-sm">{candidate.mobile_number || 'N/A'}</p>
            <p className="text-white text-sm">{candidate.email || 'N/A'}</p>
        </div>
        
        <div className="h-[1px] mx-2 bg-white"></div>
        {getQuestions(candidate).map(([question, answer], index) => (
          <div key={index} className="rounded-xl px-2">
            <h4 className="font-semibold text-blue-400 mb-2 text-sm">{question}</h4>
            <p className="text-white text-sm">
              {(answer.replace(/^"|"$/g, '') || 'No answer provided')
                .split('\n')
                .map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < answer.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              }
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CandidateCard