export interface Paciente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  cpf: string;
  endereco: string;
  convenio?: string;
  numeroConvenio?: string;
  status: 'Ativo' | 'Inativo';
  ultimaConsulta?: string;
  psicologo?: string;
}