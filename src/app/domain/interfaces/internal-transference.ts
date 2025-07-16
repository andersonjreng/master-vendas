import { Product } from "./product-model";

export interface InternalTransference {
  id: number;
  productId: number;
  internalTransferId: number;
  userId: number;
  status: string;
  requestedQuantity: number;
  checkedQuantity: number;
  quantity: number;
  createdAt: Date;
  checkedAt?: Date;
  product: Product;
}

export class InternalTransferenceDTO implements InternalTransference {
  id: number;
  productId: number;
  internalTransferId: number;
  userId: number;
  status: string;
  requestedQuantity: number;
  checkedQuantity: number;
  quantity: number;
  createdAt: Date;
  checkedAt?: Date | undefined;
  product: Product;

  constructor(item: InternalTransference) {
    this.id = item.id;
    this.productId = item.productId;
    this.internalTransferId = item.internalTransferId;
    this.userId = item.userId;
    this.status = item.status;
    this.requestedQuantity = item.requestedQuantity;
    this.checkedQuantity = item.checkedQuantity;
    this.quantity = item.quantity;
    this.createdAt = item.createdAt;
    this.checkedAt = item.checkedAt;
    this.product = item.product;
  }

  getTotal(): number {
    const valorTotal = this.product.price * this.requestedQuantity;
    return valorTotal;
  }
}
