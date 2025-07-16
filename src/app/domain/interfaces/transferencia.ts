export interface Transferencia {
  id: number;
  productId: number;
  internalTransferId: number;
  checkedByUserId: number | null;
  status: string;
  requestedQuantity: number;
  checkedQuantity: number;
  quantity: number;
  createdAt: string;
  checkedAt: string | null;
  internalTransfer: any | null; // Tipo pode ser ajustado conforme necessário
}

export interface ItemTransferencia {
  id: number;
  productId: number;
  internalTransferId: number;
  checkedByUserId: number | null;
  status: string;
  requestedQuantity: number;
  checkedQuantity: number;
  quantity: number;
  createdAt: string;
  checkedAt: string | null;
}
