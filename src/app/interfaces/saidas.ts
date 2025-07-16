export interface Saidas {
    id: number;
    atendente: string;
    usina: string;
    quantidade: number;
    categoria: string;
    dataSaida: string;
    modelo: string;
    entreguea: string;
    destinatario: string;
    inventario: string;
    observacao?: string; // Campo opcional
    [key: string]: any; // Para permitir propriedades adicionais, caso necessário
  }
  