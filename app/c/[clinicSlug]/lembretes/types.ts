export interface Lembrete {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  prioridade: 'alta' | 'media' | 'baixa';
  status: 'pendente' | 'concluido';
  tipo: 'reuniao' | 'tarefa' | 'consulta' | 'outro';
  responsavel?: string;
  notificar: boolean;
}