
export type ServiceCategory = 'hardware' | 'software' | 'network' | 'access' | 'telephony';

export interface ProblemType {
  id: string;
  label: string;
  responsibleTech?: string;
}

export interface ServiceItem {
  id: string;
  label: string;
  description?: string;
  responsibleTech?: string; // Name of the tech responsible (e.g., "Lyparly", "Leonardo")
  problemTypes?: ProblemType[];
}

export interface CatalogCategory {
  id: ServiceCategory;
  label: string;
  icon: string; // Icon name from lucide-react
  items: ServiceItem[];
}

export const CATALOG: CatalogCategory[] = [
  {
    id: 'access',
    label: 'Acesso e Senhas',
    icon: 'KeyRound',
    items: [
      { 
        id: 'mv', 
        label: 'Sistema MV', 
        responsibleTech: 'Suporte MV',
        problemTypes: [
          { id: 'reset_pass', label: 'Resetar Senha / Desbloqueio', responsibleTech: 'Suporte MV' },
          { id: 'access_error', label: 'Erro de Acesso / Login', responsibleTech: 'Suporte MV' },
          { id: 'no_internet', label: 'Sem Conexão / Internet', responsibleTech: 'Infraestrutura' }
        ]
      },
      { 
        id: 'sbs', 
        label: 'Sistema SBS', 
        responsibleTech: 'Cadastros',
        problemTypes: [
          { id: 'reset_pass', label: 'Resetar Senha / Desbloqueio', responsibleTech: 'Cadastros' },
          { id: 'access_error', label: 'Erro de Acesso / Login', responsibleTech: 'Cadastros' },
          { id: 'no_internet', label: 'Sem Conexão / Internet', responsibleTech: 'Infraestrutura' }
        ]
      },
      { 
        id: 'sei', 
        label: 'Sistema SEI', 
        responsibleTech: 'Cadastros',
        problemTypes: [
          { id: 'reset_pass', label: 'Resetar Senha', responsibleTech: 'Cadastros' },
          { id: 'no_internet', label: 'Sem Conexão / Internet', responsibleTech: 'Infraestrutura' }
        ]
      },
      { id: 'ad', label: 'Rede / Windows', responsibleTech: 'Suporte N1' },
      { id: 'email', label: 'E-mail / Expresso', responsibleTech: 'Cadastros' },
    ]
  },
  {
    id: 'hardware',
    label: 'Hardware / Equipamentos',
    icon: 'Monitor',
    items: [
      { id: 'computer', label: 'Computador / Notebook', responsibleTech: 'Suporte N2' },
      { id: 'printer', label: 'Impressora', responsibleTech: 'Suporte N2' },
      { id: 'peripheral', label: 'Periféricos (Mouse, Teclado)', responsibleTech: 'Suporte N2' },
    ]
  },
  {
    id: 'software',
    label: 'Software / Programas',
    icon: 'AppWindow',
    items: [
      { 
        id: 'mv', 
        label: 'Sistema MV', 
        responsibleTech: 'Suporte MV',
        problemTypes: [
          { id: 'error_msg', label: 'Mensagem de Erro', responsibleTech: 'Suporte MV' },
          { id: 'slow', label: 'Sistema Lento / Travando', responsibleTech: 'Infraestrutura' },
          { id: 'install', label: 'Instalação / Atualização', responsibleTech: 'Suporte N1' }
        ]
      },
      { 
        id: 'sbs', 
        label: 'Sistema SBS', 
        responsibleTech: 'Suporte SBS',
        problemTypes: [
          { id: 'error_msg', label: 'Mensagem de Erro', responsibleTech: 'Suporte SBS' },
          { id: 'report', label: 'Erro em Relatório', responsibleTech: 'Suporte SBS' }
        ]
      },
      { id: 'agendamento', label: 'Sistema de Agendamento', responsibleTech: 'Suporte N1' },
      { id: 'office', label: 'Pacote Office (Word, Excel)', responsibleTech: 'Suporte N1' },
      { id: 'antivirus', label: 'Antivírus', responsibleTech: 'Suporte N1' },
      { id: 'other_soft', label: 'Outros Softwares', responsibleTech: 'Suporte N2' },
    ]
  },
  {
    id: 'telephony',
    label: 'Telefonia e Comunicação',
    icon: 'Phone',
    items: [
      { id: 'desk_phone', label: 'Telefone Fixo / Ramal', responsibleTech: 'Equipe de Telefonia' },
      { id: 'corporate_mobile', label: 'Celular Corporativo', responsibleTech: 'Equipe de Telefonia' },
      { id: 'internet_point', label: 'Ponto de Rede / Internet', responsibleTech: 'Infraestrutura' },
    ]
  }
];

export const getResponsibleTech = (categoryId: string, itemId: string, problemTypeId?: string): string | undefined => {
  const category = CATALOG.find(c => c.id === categoryId);
  if (!category) return undefined;
  
  const item = category.items.find(i => i.id === itemId);
  if (!item) return undefined;

  if (problemTypeId && item.problemTypes) {
    const problem = item.problemTypes.find(p => p.id === problemTypeId);
    if (problem?.responsibleTech) {
      return problem.responsibleTech;
    }
  }

  return item.responsibleTech;
};
