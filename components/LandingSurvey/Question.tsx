import type { QuestionType, OptionType } from "@/types"

interface QuestionProps {
  question: QuestionType
  onAnswer: (questionId: string, optionId: string) => void
  selectedOption: string | undefined
}

export default function Question({ question, onAnswer, selectedOption }: QuestionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 font-poppins text-gray-800">{question.titulo}</h2>
      {question.options ? (
        <div className="space-y-2">
          {question.options.map((option: OptionType) => (
            <label
              key={option.id}
              className="flex items-center p-3 border rounded-md cursor-pointer transition-colors hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500"
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => onAnswer(question.id, option.id)}
                className="sr-only"
              />
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3 flex-shrink-0">
                {selectedOption === option.id && <div className="w-3 h-3 bg-blue-600 rounded-full m-0.5"></div>}
              </div>
              <span className="text-gray-700">{option.texto}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      )}
    </div>
  )
}