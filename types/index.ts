export interface QuestionType {
  id: string;
  encuestaId: string;
  titulo: string;
  options?: OptionType[];
}

export interface OptionType {
  id: string;
  preguntaId: string;
  texto: string;
  votos: number;
}