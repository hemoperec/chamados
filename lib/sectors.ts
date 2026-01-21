export type Priority = '1' | '2' | '3';

export interface Sector {
  id: string;
  name: string;
  priority: Priority;
  location?: string;
}

export const SECTORS: Sector[] = [
<<<<<<< HEAD
  // --- PRIORIDADE CRÍTICA (1) - 1 Hora ---
  // Gestão e Atendimento ao Público
=======
  // --- PRIORIDADE MÁXIMA (1) ---
  // Presidência, Gerências, Diretorias
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
  { id: 'presidencia', name: 'Presidência', priority: '1', location: 'Administração' },
  { id: 'gabinete-presidencia', name: 'Gabinete da Presidência', priority: '1', location: 'Administração' },
  { id: 'secretaria-presidencia', name: 'Secretaria da Presidência', priority: '1', location: 'Administração' },
  
  { id: 'diretoria-articulacao', name: 'Diretoria de Articulação', priority: '1', location: 'Administração' },
  { id: 'diretoria-juridica', name: 'Diretoria Jurídica / Assessoria Jurídica', priority: '1', location: 'Administração' },
  { id: 'diretoria-adm-fin', name: 'Diretoria de Administração e Finanças (DAF)', priority: '1', location: 'Administração' },
  { id: 'diretoria-hemoterapia', name: 'Diretoria de Hemoterapia (DHEMOTE)', priority: '1', location: 'Administração' },
  { id: 'diretoria-ensino', name: 'Diretoria de Ensino e Pesquisa', priority: '1', location: 'Administração' },

  { id: 'gadm-gerencia', name: 'GADM - Gerência de Administração', priority: '1', location: 'Prédio Anexo/Administração' },
  { id: 'gae-gerencia', name: 'GAE - Gerência de Ações Estratégicas', priority: '1', location: 'Prédio Anexo/Administração' },
  { id: 'geinter-gerencia', name: 'GEINTER - Gerência de Interiorização', priority: '1', location: 'Administração' },
  { id: 'ggp-gerencia', name: 'GGP - Gerência de Gestão de Pessoas', priority: '1', location: 'Administração' },
  { id: 'gfin-gerencia', name: 'Gerência de Finanças (GFIN)', priority: '1', location: 'Administração' },
  { id: 'unifin-gerencia', name: 'Gerência Financeira (UNIFIN)', priority: '1', location: 'Administração' },
  { id: 'comunicacao-gerencia', name: 'Gerência de Comunicação e Marketing', priority: '1', location: 'Administração' },
<<<<<<< HEAD
  
  // Recepções (Público)
  { id: 'recepcao-doador', name: 'Recepção do Doador', priority: '1', location: 'Térreo' },
  { id: 'recepcao-terreo-hospital', name: 'Recepção Térreo Hospital', priority: '1', location: 'Hospital Térreo' },
  { id: 'recepcao-1-andar', name: 'Recepção 1º Andar', priority: '1', location: '1º Andar' },
  { id: 'recepcao-2-andar', name: 'Recepção 2º Andar', priority: '1', location: '2º Andar' },
  { id: 'recepcao-3-andar', name: 'Recepção 3º Andar (Transfusão/Quimio)', priority: '1', location: '3º Andar' },
  { id: 'recepcao-4-andar', name: 'Recepção 4º Andar (Pediatria)', priority: '1', location: '4º Andar' },
  { id: 'recepcao-5-andar', name: 'Recepção 5º Andar (Oncologia)', priority: '1', location: '5º Andar' },
  { id: 'recepcao-fracionamento', name: 'Recepção Fracionamento', priority: '1', location: 'Térreo' },

  // Assistencial (Público/Pacientes)
  { id: 'consultorio-1', name: 'Consultório 1', priority: '1', location: 'Ambulatório' },
  { id: 'consultorio-2', name: 'Consultório 2', priority: '1', location: 'Ambulatório' },
  { id: 'consultorio-3', name: 'Consultório 3', priority: '1', location: 'Ambulatório' },
  { id: 'consultorio-4', name: 'Consultório 4', priority: '1', location: 'Ambulatório' },
  { id: 'consultorio-5', name: 'Consultório 5', priority: '1', location: 'Ambulatório' },
  { id: 'consultorio-6', name: 'Consultório 6', priority: '1', location: 'Ambulatório' },
  { id: 'consultorio-7', name: 'Consultório 7', priority: '1', location: 'Ambulatório' },
  { id: 'consultorio-8', name: 'Consultório 8', priority: '1', location: 'Ambulatório' },
  { id: 'consultorio-9', name: 'Consultório 9', priority: '1', location: 'Ambulatório' },

  { id: 'ambulatorio-chefia', name: 'Ambulatório - Chefia', priority: '1', location: 'Ambulatório' },
  { id: 'enfermaria-adulto', name: 'Enfermaria Adulto', priority: '1', location: '2º Andar' },
  { id: 'enfermaria-pediatrica', name: 'Enfermaria Pediátrica', priority: '1', location: '4º Andar' },
  { id: 'uti', name: 'UTI', priority: '1', location: '1º Andar' },
  { id: 'spa-adulto', name: 'SPA Adulto', priority: '1', location: 'Térreo' },
  { id: 'spa-pediatrico', name: 'SPA Pediátrico', priority: '1', location: 'Térreo' },
  
  { id: 'quimioterapia', name: 'Quimioterapia', priority: '1', location: '3º Andar' },
  { id: 'transfusao', name: 'Sala de Transfusão', priority: '1', location: '3º Andar' },
  { id: 'oncologia', name: 'Oncologia', priority: '1', location: '5º Andar' },
  { id: 'coleta-doador', name: 'Coleta Doador - Sala de Doação', priority: '1', location: 'Térreo' },
  { id: 'triagem-doador', name: 'Triagem Doador', priority: '1', location: 'Térreo' },

  // --- PRIORIDADE NORMAL (2) - 3 Horas ---
  // Áreas Importantes (Apoio / Backoffice)
  { id: 'ti-chefia', name: 'UTIC - Chefia / TI', priority: '2', location: 'Administração' },
  { id: 'suporte-informatica', name: 'Suporte de Informática - HELPDESK', priority: '2', location: 'Administração' },
  
  { id: 'laboratorio-imuno', name: 'Laboratório Imunohematologia', priority: '2', location: 'Térreo' },
  { id: 'laboratorio-sorologia', name: 'Laboratório de Sorologia', priority: '2', location: 'Térreo' },
  { id: 'laboratorio-nat', name: 'Laboratório NAT', priority: '2', location: 'Térreo' },
  
  { id: 'expedicao-chefia', name: 'Expedição - Chefia', priority: '2', location: 'Térreo' },
  { id: 'expedicao', name: 'Expedição', priority: '2', location: 'Térreo' },
=======
  { id: 'ti-chefia', name: 'UTIC - Chefia / TI', priority: '1', location: 'Administração' },
  { id: 'suporte-informatica', name: 'Suporte de Informática - HELPDESK', priority: '1', location: 'Administração' }, // TI often treats itself as high priority for access

  // --- PRIORIDADE 2 ---
  // Expedição, Recepções, Almoxarifado
  { id: 'expedicao-chefia', name: 'Expedição - Chefia', priority: '2', location: 'Térreo' },
  { id: 'expedicao', name: 'Expedição', priority: '2', location: 'Térreo' },
  { id: 'vigilante-expedicao', name: 'Vigilante/Expedição', priority: '2', location: 'Térreo' },
  
  { id: 'recepcao-doador', name: 'Recepção do Doador', priority: '2', location: 'Térreo' },
  { id: 'recepcao-terreo-hospital', name: 'Recepção Térreo Hospital', priority: '2', location: 'Hospital Térreo' },
  { id: 'recepcao-1-andar', name: 'Recepção 1º Andar', priority: '2', location: '1º Andar' },
  { id: 'recepcao-2-andar', name: 'Recepção 2º Andar', priority: '2', location: '2º Andar' },
  { id: 'recepcao-3-andar', name: 'Recepção 3º Andar (Transfusão/Quimio)', priority: '2', location: '3º Andar' },
  { id: 'recepcao-4-andar', name: 'Recepção 4º Andar (Pediatria)', priority: '2', location: '4º Andar' },
  { id: 'recepcao-5-andar', name: 'Recepção 5º Andar (Oncologia)', priority: '2', location: '5º Andar' },
  { id: 'recepcao-fracionamento', name: 'Recepção Fracionamento', priority: '2', location: 'Térreo' },
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
  
  { id: 'almoxarifado-central', name: 'Almoxarifado Central', priority: '2', location: 'Anexo' },
  { id: 'caf', name: 'CAF (Central de Abastecimento Farmacêutico)', priority: '2', location: 'Anexo' },

<<<<<<< HEAD
  // --- PRIORIDADE BAIXA (3) - 6 Horas ---
  // Serviços não fundamentais
  { id: 'vigilante-expedicao', name: 'Vigilante/Expedição', priority: '3', location: 'Térreo' },
=======
  // --- PRIORIDADE 3 (LINHA DE FRENTE) ---
  // Consultórios, Enfermarias, Ambulatórios, Laboratórios
  { id: 'consultorio-1', name: 'Consultório 1', priority: '3', location: 'Ambulatório' },
  { id: 'consultorio-2', name: 'Consultório 2', priority: '3', location: 'Ambulatório' },
  { id: 'consultorio-3', name: 'Consultório 3', priority: '3', location: 'Ambulatório' },
  { id: 'consultorio-4', name: 'Consultório 4', priority: '3', location: 'Ambulatório' },
  { id: 'consultorio-5', name: 'Consultório 5', priority: '3', location: 'Ambulatório' },
  { id: 'consultorio-6', name: 'Consultório 6', priority: '3', location: 'Ambulatório' },
  { id: 'consultorio-7', name: 'Consultório 7', priority: '3', location: 'Ambulatório' },
  { id: 'consultorio-8', name: 'Consultório 8', priority: '3', location: 'Ambulatório' },
  { id: 'consultorio-9', name: 'Consultório 9', priority: '3', location: 'Ambulatório' },

  { id: 'ambulatorio-chefia', name: 'Ambulatório - Chefia', priority: '3', location: 'Ambulatório' },
  { id: 'enfermaria-adulto', name: 'Enfermaria Adulto', priority: '3', location: '2º Andar' },
  { id: 'enfermaria-pediatrica', name: 'Enfermaria Pediátrica', priority: '3', location: '4º Andar' },
  { id: 'uti', name: 'UTI', priority: '3', location: '1º Andar' },
  { id: 'spa-adulto', name: 'SPA Adulto', priority: '3', location: 'Térreo' },
  { id: 'spa-pediatrico', name: 'SPA Pediátrico', priority: '3', location: 'Térreo' },
  
  { id: 'quimioterapia', name: 'Quimioterapia', priority: '3', location: '3º Andar' },
  { id: 'transfusao', name: 'Sala de Transfusão', priority: '3', location: '3º Andar' },
  { id: 'oncologia', name: 'Oncologia', priority: '3', location: '5º Andar' },
  { id: 'coleta-doador', name: 'Coleta Doador - Sala de Doação', priority: '3', location: 'Térreo' },
  { id: 'triagem-doador', name: 'Triagem Doador', priority: '3', location: 'Térreo' },
  
  { id: 'laboratorio-imuno', name: 'Laboratório Imunohematologia', priority: '3', location: 'Térreo' },
  { id: 'laboratorio-sorologia', name: 'Laboratório de Sorologia', priority: '3', location: 'Térreo' },
  { id: 'laboratorio-nat', name: 'Laboratório NAT', priority: '3', location: 'Térreo' },
  
  // Others mentioned
  { id: 'servico-social', name: 'Serviço Social', priority: '3', location: 'Térreo' },
  { id: 'psicologia', name: 'Psicologia', priority: '3', location: 'Térreo' },
  { id: 'odontologia', name: 'Odontologia', priority: '3', location: 'Térreo' },
  { id: 'nutricao', name: 'Nutrição', priority: '3', location: '2º Andar' },
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
];

export const getSectorPriority = (sectorId: string): Priority => {
  const sector = SECTORS.find(s => s.id === sectorId);
  return sector ? sector.priority : '3'; // Default to 3 if not found
};
