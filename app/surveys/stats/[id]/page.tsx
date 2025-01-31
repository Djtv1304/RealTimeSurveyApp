"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Download, RefreshCw } from "lucide-react";

const COLORS = ["#FF5733", "#FF8D1A", "#FFD700", "#7CFC00", "#00BFFF"]; // Colores más contrastantes

export default function StatsPage({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Conexión SSE al backend
  useEffect(() => {
    console.log("Conectando a SSE..."); // Mensaje de conexión SSE
    const eventSource = new EventSource(`http://localhost:3000/api/resultados?encuestaId=${params.id}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Datos recibidos desde SSE:", data); // Verificamos los datos recibidos
      // Actualiza las preguntas y opciones con los datos recibidos
      setQuestions(data);
      setLastUpdate(new Date());
    };

    eventSource.onerror = (error) => {
      console.error("Error en la conexión SSE", error);
      eventSource.close();
    };

    // Verificamos si la conexión SSE está activa
    eventSource.onopen = () => {
      console.log("Conexión SSE establecida correctamente");
    };

    return () => {
      console.log("Cerrando la conexión SSE...");
      eventSource.close(); // Cierra la conexión SSE cuando el componente se desmonta
    };
  }, [params.id]);

  const refreshData = async () => {
    setLoading(true);
    // Simula la llamada a la API para actualizar datos
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setLoading(false);
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      questions.map((q: any) => `${q.titulo},${q.opciones.map((o: any) => `${o.texto}:${o.votos}`).join(",")}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "survey_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Survey Statistics</h1>
            <p className="text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={refreshData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {questions.length === 0 ? (
            <div>No data available</div>
          ) : (
            questions.map((question) => (
              <Card className="p-6" key={question.id}>
                <h3 className="text-lg font-semibold mb-4">{question.titulo}</h3>
                <div className="h-[300px]">
                  <p className="mb-2 text-center">Total Votes</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={question.opciones}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="texto" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="votos"
                        fill={COLORS[0]} // Color más visible
                        barSize={30}
                        isAnimationActive={false} // Para evitar animación al actualizar
                      >
                        {question.opciones.map((index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}