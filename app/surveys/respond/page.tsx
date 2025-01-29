"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2 } from "lucide-react";

interface SurveyResponse {
  firstName: string;
  lastName: string;
  surveyCode: string;
  answers: Record<string, string>;
}

const mockQuestions = [
  {
    id: "1",
    question: "How satisfied are you with our service?",
    type: "choice",
    options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
  },
  {
    id: "2",
    question: "What improvements would you suggest?",
    type: "text",
  },
];

export default function SurveyResponsePage() {
  const [step, setStep] = useState<"init" | "survey">("init");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SurveyResponse>({
    firstName: "",
    lastName: "",
    surveyCode: "",
    answers: {},
  });
  const { toast } = useToast();

  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100;

  const handleInitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.surveyCode || !formData.firstName || !formData.lastName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    setStep("survey");
  };

  const handleAnswer = (answer: string) => {
    if (isSubmitting) return;

    setFormData((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [mockQuestions[currentQuestion].id]: answer,
      },
    }));

    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast({
      title: "Success!",
      description: "Your responses have been submitted successfully.",
    });
    setIsSubmitting(false);
  };

  if (step === "init") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md p-8 space-y-6 animate-in">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Survey Response</h1>
            <p className="text-gray-500">Please enter your information to begin</p>
          </div>

          <form onSubmit={handleInitSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="surveyCode">Survey Code</Label>
              <Input
                id="surveyCode"
                value={formData.surveyCode}
                onChange={(e) => setFormData({ ...formData, surveyCode: e.target.value })}
                placeholder="Enter survey code"
                className="text-2xl tracking-widest text-center"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Start Survey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="mb-8 space-y-4">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-center text-sm text-gray-500">
            Question {currentQuestion + 1} of {mockQuestions.length}
          </p>
        </div>

        <Card className="p-8 space-y-6 animate-in">
          <h2 className="text-2xl font-bold">
            {mockQuestions[currentQuestion].question}
          </h2>

          <div className="space-y-4">
            {mockQuestions[currentQuestion].type === "choice" ? (
              <div className="space-y-3">
                {mockQuestions[currentQuestion].options?.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-4 transition-all"
                    onClick={() => handleAnswer(option)}
                    disabled={isSubmitting}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  placeholder="Type your answer here..."
                  className="w-full"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAnswer((e.target as HTMLInputElement).value);
                    }
                  }}
                  disabled={isSubmitting}
                />
                <Button
                  className="w-full"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    handleAnswer(input.value);
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Next"
                  )}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}