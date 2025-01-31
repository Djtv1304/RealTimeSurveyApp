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
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Tipos de encuesta con la propiedad status añadida
interface Survey {
  id: string;
  titulo: string;
  descripcion: string;
  codigoAcceso: string;
  fechaCreacion: any; // Firebase timestamp
  participantes: number;
  status: "active" | "completed" | "draft"; // Agregar la propiedad status
}

export default function DashboardPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [filter, setFilter] = useState<
    "all" | "active" | "completed" | "draft"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const formatDate = (timestamp: any) => {
    // Verifica si el timestamp es un objeto Firebase Timestamp
    if (timestamp && timestamp._seconds) {
      // Crear un objeto Date usando _seconds (convertido a milisegundos)
      const date = new Date(timestamp._seconds * 1000); // Firebase timestamp tiene la propiedad '_seconds'
      console.log("Fecha convertida:", date); // Verifica la fecha convertida
      return date.toLocaleDateString("es-ES", {
        weekday: "short", // Día de la semana (abreviado)
        year: "numeric", // Año completo
        month: "short", // Mes abreviado
        day: "numeric", // Día del mes
      });
    }
    return "Invalid Date";
  };

  // Obtener encuestas desde el backend
  const fetchSurveys = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found in localStorage"); // Si no hay token
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/encuestas", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("API response data:", data); // Verificar la respuesta de la API

      if (data.encuestas) {
        // Asignar un estado a las encuestas de manera predeterminada
        const surveysWithStatus = data.encuestas.map((survey: any) => ({
          ...survey,
          status: survey.participantes > 0 ? "active" : "draft", // Ejemplo de lógica de estado
        }));
        setSurveys(surveysWithStatus);
      } else {
        console.error("No encuestas found in API response");
      }
    } catch (error) {
      console.error("Error al obtener las encuestas", error);
    }
  };

  // Llamar a fetchSurveys cuando el componente se monte
  useEffect(() => {
    fetchSurveys();
  }, []);

  // Filtrar las encuestas según el filtro y la búsqueda
  const filteredSurveys = surveys.filter((survey) => {
    const matchesFilter = filter === "all" || survey.status === filter;
    const matchesSearch = survey.titulo
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Depurar el estado de los surveys filtrados
  console.log("Filtered Surveys:", filteredSurveys);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              SurveyPro
            </h1>
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
          {filteredSurveys.length === 0 ? (
            <div>No surveys found</div>
          ) : (
            filteredSurveys.map((survey) => (
              <Card
                key={survey.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {survey.titulo}
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
                    {survey.status.charAt(0).toUpperCase() +
                      survey.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDate(survey.fechaCreacion)}{" "}
                    {/* Mostrar la fecha legible */}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Users className="mr-2 h-4 w-4" />
                    {survey.participantes} participants
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-2">Description:</span>
                    {survey.descripcion}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-2">Access Code:</span>
                    {survey.codigoAcceso}
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
            ))
          )}
        </div>
      </main>
    </div>
  );
}
