export interface Transacao {
  id: number;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  status: 'pago' | 'pendente';
  formaPagamento?: string;
  recorrente: boolean;
  vencimento?: string;
  observacoes?: string;
}

export interface ResumoFinanceiro {
  receitaTotal: number;
  despesaTotal: number;
  lucroLiquido: number;
  receitasPendentes: number;
  despesasPendentes: number;
  percentualCrescimento: number;
}