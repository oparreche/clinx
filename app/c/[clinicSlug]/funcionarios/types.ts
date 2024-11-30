export interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  unidade: string;
  dataAdmissao: string;
  departamento: string;
  turno: 'Manhã' | 'Tarde' | 'Integral';
  status: 'Ativo' | 'Inativo' | 'Férias' | 'Licença';
}