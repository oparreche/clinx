export interface Tenant {
  id: string;
  slug: string;
  name: string;
  plan: 'basic' | 'premium' | 'enterprise';
  settings: {
    theme?: {
      primaryColor: string;
      secondaryColor: string;
    };
    features: {
      appointments: boolean;
      financialManagement: boolean;
      multipleLocations: boolean;
      // Adicione mais features conforme necessário
    };
  };
  status: 'active' | 'suspended' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
