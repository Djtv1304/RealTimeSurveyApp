import { Suspense } from "react";
import SurveyEditor from "./survey-editor";

// This is required for static site generation with dynamic routes
export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

export default function SurveyEditorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SurveyEditor />
    </Suspense>
  );
}