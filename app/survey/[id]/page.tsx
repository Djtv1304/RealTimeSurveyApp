import { Suspense } from "react"
import { notFound } from "next/navigation"
import SurveyQuestions from "@/components/LandingSurvey/SurveyQuestions"
import LoadingSpinner from "@/components/LandingSurvey/LoadingSpinner"

async function getSurveyQuestions(surveyId: string) {
  const res = await fetch(`http://localhost:3000/api/preguntas/?encuestaId=${surveyId}`, { cache: "no-store" })
  if (!res.ok) {
    throw new Error("Failed to fetch survey questions")
  }
  return res.json()
}

export default async function SurveyPage({ params }: { params: { id: string } }) {
  let questions
  try {
    questions = await getSurveyQuestions(params.id)
  } catch (error) {
    notFound()
  }

  if (!questions || questions.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8 font-poppins">SurveyPro</h1>
        <Suspense fallback={<LoadingSpinner />}>
          <SurveyQuestions surveyId={params.id} initialQuestions={questions} />
        </Suspense>
      </div>
    </div>
  )
}