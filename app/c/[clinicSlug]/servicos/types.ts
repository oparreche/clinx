export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  duracao: string;
  preco: number;
  disponibilidade: string[];
  status: 'Ativo' | 'Inativo';
  categoria: string;
  maximoPacientes?: number;
  psicologos?: string[];
}