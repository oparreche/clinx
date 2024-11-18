export interface Psicologo {
  id: number;
  nome: string;
  crp: string;
  especialidade: string;
  unidade: string;
  email: string;
  telefone: string;
  status: 'Ativo' | 'Inativo';
  horarios: string[];
  pacientesAtivos: number;
}