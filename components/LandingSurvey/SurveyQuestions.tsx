"use client"

import { useState, useEffect } from "react"
import Question from "./Question"
import type { QuestionType, OptionType } from "../../types"

interface SurveyQuestionsProps {
  surveyId: string
  initialQuestions: QuestionType[]
}

export default function SurveyQuestions({ surveyId, initialQuestions }: SurveyQuestionsProps) {
  const [questions, setQuestions] = useState<QuestionType[]>(initialQuestions)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch de las opciones de cada pregunta cuando se cargan las preguntas
  useEffect(() => {
    const fetchOptions = async (questionId: string) => {
      const res = await fetch(`http://localhost:3000/api/opciones?preguntaId=${questionId}`, {
        cache: "no-store",
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (!res.ok) throw new Error("Failed to fetch options")
      const options: OptionType[] = await res.json()
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q.id === questionId ? { ...q, options } : q))
      )
    }

    questions.forEach((question) => {
      if (!question.options) {
        fetchOptions(question.id)
      }
    })
  }, [questions])

  // Método para manejar la selección de respuestas
  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId })) // Guardamos la opción seleccionada
  }

  // Método que se ejecuta al presionar "NEXT"
  const handleNext = async () => {
    const currentAnswer = answers[currentQuestion.id] // Obtenemos la respuesta seleccionada

    if (!currentAnswer) {
      alert("Por favor, selecciona una opción antes de continuar.") // Verificamos que haya una respuesta seleccionada
      return
    }

    // Enviar el voto seleccionado al backend solo cuando el usuario presiona "NEXT"
    setIsSubmitting(true)
    try {
      await fetch("http://localhost:3000/api/resultados", {
        method: "POST",
        body: JSON.stringify({
          encuestaId: surveyId,
          preguntaId: currentQuestion.id,
          optionId: currentAnswer, // Enviamos el voto seleccionado
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1) // Avanzamos a la siguiente pregunta
      } else {
        handleSubmit() // Si es la última pregunta, enviamos el formulario
      }
    } catch (error) {
      console.error("Error al enviar el voto:", error)
      alert("Hubo un problema al enviar tu respuesta. Intenta nuevamente.")
    }
    setIsSubmitting(false)
  }

  // Método que se ejecuta al finalizar la encuesta
  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulamos una espera de la sumisión (aquí puedes enviar los resultados finales o hacer otro tipo de acción)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    alert("¡Encuesta enviada exitosamente!")
  }

  const currentQuestion = questions[currentQuestionIndex]

  if (!currentQuestion) {
    return <div className="text-center text-gray-700">No questions available.</div>
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Question
        question={currentQuestion}
        onAnswer={handleAnswer}
        selectedOption={answers[currentQuestion.id]}
      />
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id] || isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {currentQuestionIndex === questions.length - 1 ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
        </button>
      </div>
    </div>
  )
}