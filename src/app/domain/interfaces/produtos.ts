export interface Produtos {
  id: number,
  nome: string,
  qtd: number,
  ean?: number,
  code: number,
  qtdConferida?: number,
  cancelado?: boolean,
  price?: number
}

export interface ProdutoEncontrado {
  id: number; // ID do produto
  productId: number; // ID do produto na base de dados
  internalTransferId: number; // ID da transferência interna
  status: string; // Status do produto (por exemplo, 'S' para conferido e 'N' para não conferido)
  requestedQuantity: number; // Quantidade solicitada
  checkedQuantity: number; // Quantidade verificada
  quantity: number; // Quantidade total
  description: string;
  ean?: any;
  qtd?: number;
  cancelado?: boolean;
  conferido?: string;
  qtdConferida?: number,
  price?: number,

  // Adicione aqui os outros campos que deseja incluir
}

export interface ItemTransfer {
  nome: string,
  qtd: number,
  code: number,
  price: number,
  status: string
}

export interface ProdutosRequest {
  nome: string,
  qtd: number,
  code: number,
  requestedQuantity?: number,
  checkedQuantity?: number,
  qtdConferida?: number,
  cancelado?: boolean,
}
