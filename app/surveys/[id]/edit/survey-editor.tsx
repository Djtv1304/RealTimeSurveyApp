"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  GripVertical,
  Plus,
  Save,
  Eye,
  Trash2,
  ArrowUp,
  ArrowDown,
  Settings,
} from "lucide-react";
import { useState } from "react";

interface Question {
  id: string;
  type: "text" | "choice" | "multiple";
  title: string;
  required: boolean;
  options?: string[];
}

export default function SurveyEditor() {
  const [title, setTitle] = useState("New Survey");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      type: "text",
      title: "What's your feedback about our service?",
      required: true,
    },
    {
      id: "2",
      type: "choice",
      title: "How satisfied are you with our product?",
      required: true,
      options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
    },
  ]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Survey saved",
      description: "All changes have been saved successfully.",
    });
    setSaving(false);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "text",
      title: "New Question",
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const newQuestions = [...questions];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[newIndex]] = [
      newQuestions[newIndex],
      newQuestions[index],
    ];
    setQuestions(newQuestions);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold bg-transparent border-none focus:ring-0 px-0 w-[300px]"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 grid grid-cols-3 gap-8">
        {/* Editor */}
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <Label htmlFor="description">Survey Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for your survey..."
              className="mt-2"
            />
          </Card>

          {questions.map((question, index) => (
            <Card key={question.id} className="p-6">
              <div className="flex items-start space-x-4">
                <GripVertical className="h-5 w-5 text-gray-400 mt-2" />
                <div className="flex-1 space-y-4">
                  <Input
                    value={question.title}
                    onChange={(e) =>
                      setQuestions(
                        questions.map((q) =>
                          q.id === question.id
                            ? { ...q, title: e.target.value }
                            : q
                        )
                      )
                    }
                    placeholder="Enter your question..."
                    className="text-lg font-medium"
                  />

                  {question.type === "choice" && question.options && (
                    <div className="space-y-2 pl-6">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options!];
                              newOptions[optionIndex] = e.target.value;
                              setQuestions(
                                questions.map((q) =>
                                  q.id === question.id
                                    ? { ...q, options: newOptions }
                                    : q
                                )
                              );
                            }}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newOptions = question.options!.filter(
                                (_, i) => i !== optionIndex
                              );
                              setQuestions(
                                questions.map((q) =>
                                  q.id === question.id
                                    ? { ...q, options: newOptions }
                                    : q
                                )
                              );
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newOptions = [...question.options!, "New Option"];
                          setQuestions(
                            questions.map((q) =>
                              q.id === question.id
                                ? { ...q, options: newOptions }
                                : q
                            )
                          );
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Option
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {index > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveQuestion(index, "up")}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  )}
                  {index < questions.length - 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveQuestion(index, "down")}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setQuestions(questions.filter((q) => q.id !== question.id))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          <Button onClick={addQuestion} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>

        {/* Preview */}
        <div className="col-span-1">
          <div className="sticky top-24">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <Separator className="my-4" />
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">{title}</h2>
                {description && <p className="text-gray-600">{description}</p>}
                {questions.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <p className="font-medium">{question.title}</p>
                    {question.type === "text" && (
                      <Input disabled placeholder="Text answer" />
                    )}
                    {question.type === "choice" &&
                      question.options?.map((option, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            disabled
                          />
                          <span>{option}</span>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}