"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Plus,
  Search,
  Bell,
  User,
  Calendar,
  Users,
  Clock,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Survey {
  id: string;
  title: string;
  date: string;
  participants: number;
  status: "active" | "completed" | "draft";
}

const mockSurveys: Survey[] = [
  {
    id: "1",
    title: "Customer Satisfaction Q2",
    date: "2024-04-15",
    participants: 234,
    status: "active",
  },
  {
    id: "2",
    title: "Employee Engagement",
    date: "2024-04-10",
    participants: 89,
    status: "completed",
  },
  {
    id: "3",
    title: "Product Feedback",
    date: "2024-04-05",
    participants: 0,
    status: "draft",
  },
  // Add more mock surveys as needed
];

export default function DashboardPage() {
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSurveys = mockSurveys.filter((survey) => {
    const matchesFilter = filter === "all" || survey.status === filter;
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">SurveyPro</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search surveys..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All Surveys
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              onClick={() => setFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              onClick={() => setFilter("completed")}
            >
              Completed
            </Button>
            <Button
              variant={filter === "draft" ? "default" : "outline"}
              onClick={() => setFilter("draft")}
            >
              Drafts
            </Button>
          </div>
          <Button asChild>
            <Link href="/surveys/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Survey
            </Link>
          </Button>
        </div>

        {/* Survey Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSurveys.map((survey) => (
            <Card key={survey.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {survey.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    survey.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : survey.status === "completed"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="mr-2 h-4 w-4" />
                  {new Date(survey.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="mr-2 h-4 w-4" />
                  {survey.participants} participants
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="mr-2 h-4 w-4" />
                  Last updated 2 hours ago
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end space-x-3">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/surveys/${survey.id}`}>View Results</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/surveys/${survey.id}/edit`}>Edit Survey</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}